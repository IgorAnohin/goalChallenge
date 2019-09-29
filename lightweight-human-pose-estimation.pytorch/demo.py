import argparse
import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '4' 
save_var = sys.stdout
sys.stdout = open('logfile', 'w')



import cv2
import numpy as np
import torch

from models.with_mobilenet import PoseEstimationWithMobileNet
from modules.keypoints import extract_keypoints, group_keypoints
from modules.load_state import load_state
from modules.pose import Pose, propagate_ids
from val import normalize, pad_width

import matplotlib.pyplot as plt
import numpy as np

from darkflow.net.build import TFNet
import cv2

options = {"model": "cfg/yolo_custom.cfg"}
tfnet2 = TFNet(options)
tfnet2.load_from_ckpt()


class ImageReader(object):
    def __init__(self, file_names):
        self.file_names = file_names
        self.max_idx = len(file_names)

    def __iter__(self):
        self.idx = 0
        return self

    def __next__(self):
        if self.idx == self.max_idx:
            raise StopIteration
        img = cv2.imread(self.file_names[self.idx], cv2.IMREAD_COLOR)
        if img.size == 0:
            raise IOError('Image {} cannot be read'.format(self.file_names[self.idx]))
        self.idx = self.idx + 1
        return img


class VideoReader(object):
    def __init__(self, file_name):
        self.counter = 0
        self.file_name = file_name
        #try:  # OpenCV needs int to read from webcam
        #    self.file_name = int(file_name)
        #except ValueError:
        #    pass

    def __iter__(self):
        self.cap = cv2.VideoCapture(self.file_name)
        if not self.cap.isOpened():
            raise IOError('Video {} cannot be opened'.format(self.file_name))
        return self

    def __next__(self):
        was_read, img = self.cap.read()
        self.counter += 20
        self.cap.set(1, self.counter)
        if not was_read:
            raise StopIteration
        return img


def infer_fast(net, img, net_input_height_size, stride, upsample_ratio, cpu,
               pad_value=(0, 0, 0), img_mean=(128, 128, 128), img_scale=1/256):
    height, width, _ = img.shape
    scale = net_input_height_size / height

    scaled_img = cv2.resize(img, (0, 0), fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    scaled_img = normalize(scaled_img, img_mean, img_scale)
    min_dims = [net_input_height_size, max(scaled_img.shape[1], net_input_height_size)]
    padded_img, pad = pad_width(scaled_img, stride, pad_value, min_dims)

    tensor_img = torch.from_numpy(padded_img).permute(2, 0, 1).unsqueeze(0).float()
    if not cpu:
        tensor_img = tensor_img.cuda()

    stages_output = net(tensor_img)

    stage2_heatmaps = stages_output[-2]
    heatmaps = np.transpose(stage2_heatmaps.squeeze().cpu().data.numpy(), (1, 2, 0))
    heatmaps = cv2.resize(heatmaps, (0, 0), fx=upsample_ratio, fy=upsample_ratio, interpolation=cv2.INTER_CUBIC)

    stage2_pafs = stages_output[-1]
    pafs = np.transpose(stage2_pafs.squeeze().cpu().data.numpy(), (1, 2, 0))
    pafs = cv2.resize(pafs, (0, 0), fx=upsample_ratio, fy=upsample_ratio, interpolation=cv2.INTER_CUBIC)

    return heatmaps, pafs, scale, pad


def run_demo(net, image_providers, height_size, cpu, track_ids):
    net = net.eval()
    if not cpu:
        net = net.cpu()

    ball_center_id_prev = None
    ball_center_cur_prev = None
    #index = 0
    #GET = 20
    succeeds = 0
    failures = 0
    for ideal_img, current_image in zip(image_providers[0],image_providers[1]):
        #if index % GET:
        #    continue
        ball_center_id, pose_id = work_with_image(ideal_img, net, height_size, cpu, track_ids)
        print("BALL CENTER:", ball_center_id)
        print("HUMAN POSE:", pose_id)

        try:
            ball_center_cur, pose_cur = work_with_image(current_image, net, height_size, cpu, track_ids)
        except:
            failures += 1
            print("False. iException")
            continue

        print("BALL CENTER Cur:", ball_center_cur)
        print("HUMAN POSE Cur:", pose_cur)

        if ball_center_id and ball_center_cur:
            if ball_center_id_prev and ball_center_cur_prev:
                print("BALLS in not Nones and prevs too")

            ball_center_id_prev = ball_center_id
            ball_center_cur_prev = ball_center_cur


        #print("Start compasion")
        comparison_result = magic_with_dots(pose_id, pose_cur)
        good = 0
        bad = 0

        for res in comparison_result:
            if 0.6 <= res <= 1.5:
                good += 1
            elif -0.5 <= res <= 0:
                bad += 1
            elif -1.5 <= res <= 0.5:
                bad += 2
            elif np.isnan(res):
                bad += 1
        if good > bad * 1.5:
            succeeds += 1
            print("True. Bad:", bad, "Good:", good)
        else:
            failures += 1
            print("False. Bad:", bad, "Good:", good)



        print("Compasion", comparison_result)
    print("SUCCESSES:", succeeds, "FAILURES:", failures)
    sys.stdout = save_var
    print(int(succeeds / (succeeds + failures) * 100))


def work_with_image(img, net, height_size, cpu, track_ids):
    stride = 8
    upsample_ratio = 4
    num_keypoints = Pose.num_kpts
    #previous_poses = []

    orig_img = img.copy()
    heatmaps, pafs, scale, pad = infer_fast(net, img, height_size, stride, upsample_ratio, cpu)

    total_keypoints_num = 0
    all_keypoints_by_type = []
    for kpt_idx in range(num_keypoints):  # 19th for bg
        total_keypoints_num += extract_keypoints(heatmaps[:, :, kpt_idx], all_keypoints_by_type, total_keypoints_num)

    pose_entries, all_keypoints = group_keypoints(all_keypoints_by_type, pafs, demo=True)
    for kpt_id in range(all_keypoints.shape[0]):
        all_keypoints[kpt_id, 0] = (all_keypoints[kpt_id, 0] * stride / upsample_ratio - pad[1]) / scale
        all_keypoints[kpt_id, 1] = (all_keypoints[kpt_id, 1] * stride / upsample_ratio - pad[0]) / scale
    current_poses = []
    for n in range(len(pose_entries)):
        if len(pose_entries[n]) == 0:
            continue
        pose_keypoints = np.ones((num_keypoints, 2), dtype=np.int32) * -1
        for kpt_id in range(num_keypoints):
            if pose_entries[n][kpt_id] != -1.0:  # keypoint was found
                pose_keypoints[kpt_id, 0] = int(all_keypoints[int(pose_entries[n][kpt_id]), 0])
                pose_keypoints[kpt_id, 1] = int(all_keypoints[int(pose_entries[n][kpt_id]), 1])
        pose = Pose(pose_keypoints, pose_entries[n][18])
        #print(pose_keypoints)
        #print("HERE")
        #print(pose_entries[n][18])
        #print("HERE")
        #comparison_result = magic_with_dots(pose_keypoints)
        #print("Compasion", comparison_result)


        original_img = cv2.cvtColor(orig_img, cv2.COLOR_BGR2RGB)
        results = tfnet2.return_predict(original_img)
        #print("Results", results)

        for result in results:
            top_x = result['topleft']['x']
            top_y = result['topleft']['y']

            btm_x = result['bottomright']['x']
            btm_y = result['bottomright']['y']

            confidence = result['confidence']

            #if confidence > 0.3:
                #img = cv2.rectangle(img, (top_x, top_y), (btm_x, btm_y), (255,0,0), 3)
            return ([(top_x - btm_x)/2, (top_y - btm_y)/2], pose_keypoints)
        return (None, pose_keypoints)


        #frame_points, frame_vectors = get_pose_data(frame, args.thr, network, dataset_info)
        #template_points, template_vectors = get_pose_data(template, args.thr, network, dataset_info)

        #comparison_result = compare(frame_vectors, template_vectors)
        #current_poses.append(pose)
        #pose.draw(img)

    #img = cv2.addWeighted(orig_img, 0.6, img, 0.4, 0)
    #if track_ids == True:
    #    propagate_ids(previous_poses, current_poses)
    #    #previous_poses = current_poses
    #    #for pose in current_poses:
    #    #    cv2.rectangle(img, (pose.bbox[0], pose.bbox[1]),
    #    #                  (pose.bbox[0] + pose.bbox[2], pose.bbox[1] + pose.bbox[3]), (0, 255, 0))
    #    #    cv2.putText(img, 'id: {}'.format(pose.id), (pose.bbox[0], pose.bbox[1] - 16),
    #    #                cv2.FONT_HERSHEY_COMPLEX, 0.5, (0, 0, 255))
    #cv2.imwrite("/home/ubuntu/test_photos/test" + str(q) + ".png", img) 
    #q+=1
    #print("SAVED")

def magic_with_dots(ideal_frame_points, cur_frame_points):
    ideal_frame_vectors = get_pose_vectors(ideal_frame_points)
    cur_frame_vectors = get_pose_vectors(cur_frame_points)
    return compare(ideal_frame_vectors, cur_frame_vectors)

def compare(frame_vectors, template_vectors):
    return [dot_or_none(i, t) for i, t in zip(frame_vectors, template_vectors)]

def dot_or_none(vec1, vec2):
    return np.dot(vec1, vec2) if vec1 is not None and vec2 is not None else None


def get_pose_vectors(points):
    body_parts = ['nose', 'neck',
                 'r_sho', 'r_elb', 'r_wri', 'l_sho', 'l_elb', 'l_wri',
                 'r_hip', 'r_knee', 'r_ank', 'l_hip', 'l_knee', 'l_ank',
                 'r_eye', 'l_eye',
                 'r_ear', 'l_ear']
    pose_pairs = [["neck", "r_sho"], ["neck", "l_sho"], ["r_sho", "r_elb"], ["r_elb", "r_wri"], ["l_sho", "l_elb"], ["l_elb", "l_wri"],
                  ["neck", "r_hip"], ["r_hip", "r_knee"], ["r_knee", "r_ank"], ["neck", "l_hip"], ["l_hip", "l_knee"], ["l_knee", "l_ank"], ["neck", "nose"]]
    body_parts = { body_parts[i]: i  for i in range(0, len(body_parts)) }

    normalized_vectors = []
    #print(points)

    for pair in pose_pairs:

        part_from = pair[0]
        part_to = pair[1]
        id_from = body_parts[part_from]
        id_to = body_parts[part_to]

        if points[id_from].tolist() and points[id_to].tolist():

            vector = np.array(points[id_to].tolist()) - np.array(points[id_from].tolist())
            normalized_vectors.append(vector / np.linalg.norm(vector, axis=0))
        else:
            normalized_vectors.append(None)

    return normalized_vectors


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='''Lightweight human pose estimation python demo.
                       This is just for quick results preview.
                       Please, consider c++ demo for the best performance.''')
    parser.add_argument('--checkpoint-path', type=str, default='/home/ubuntu/lightweight-human-pose-estimation.pytorch/checkpoint_iter_370000.pth', help='path to the checkpoint')
    parser.add_argument('--height-size', type=int, default=256, help='network input layer height size')
    parser.add_argument('--video', type=str, default='', help='path to video file or camera id')
    parser.add_argument('--video_current', type=str, default='', help='path to video file or camera id')
    parser.add_argument('--images', nargs='+', default='', help='path to input image(s)')
    parser.add_argument('--cpu', action='store_true', help='run network inference on cpu')
    parser.add_argument('--track-ids', default=True, help='track poses ids')
    args = parser.parse_args()

    if args.video == '' and args.images == '':
        raise ValueError('Either --video or --image has to be provided')

    net = PoseEstimationWithMobileNet()
    checkpoint = torch.load(args.checkpoint_path, map_location='cpu')
    load_state(net, checkpoint)

    ideal_frame_pruvider = VideoReader(args.video)
    current_frame_provider = VideoReader(args.video_current)

    run_demo(net, (ideal_frame_pruvider, current_frame_provider), args.height_size, True, args.track_ids)
