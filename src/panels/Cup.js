import { Panel, ListItem, Button, Group, Div, Avatar, InfoRow,Link,Cell,List, Progress} from '@vkontakte/vkui';
import React from 'react';
import PlayVideo from "./PlayVideo";
import FileSelector from "./FileSelector";

const Cup = ({ id, go, fetchedUser, access_token }) => (
    <Div id={id}>
        <Group title="Кубок недели">
            <Div>
                - Поставь камеру на такой же ракурс <br></br>
                - Запиши на видео как ты повторяешь гол Jezza из F2K<br></br> - Загрузи получившийся ролик в приложение<br/>
                 - Опубликуй видео с резултатом в сторис<br/>
                 - Отметь <Link href="https://www.sports.ru/tribuna/blogs/mama4h/2347644.html"> Sports.ru</Link> и выйграй новый мяч Лиги Чемпионов

            </Div>
        </Group>
        {fetchedUser  &&
        <Group>
            <PlayVideo/>
        </Group>}
        {fetchedUser  &&
        <Group>
            <FileSelector user_id={fetchedUser.id} access_token={access_token}/>
        </Group>}
    </Div>
);
export default Cup