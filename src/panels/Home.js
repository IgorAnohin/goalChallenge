import React from 'react';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader,Link } from '@vkontakte/vkui';

import PlayVideo from './PlayVideo';
import FileSelector from './FileSelector'

const Home = ({ id, go, fetchedUser, access_token }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>
		{/*{fetchedUser &&*/}
		{/*<Group title="User Data Fetched with VK Connect">*/}
		{/*	<ListItem*/}
		{/*		before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}*/}
		{/*		description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}*/}
		{/*	>*/}
		{/*		{`${fetchedUser.first_name} ${fetchedUser.last_name}`}*/}
		{/*	</ListItem>*/}
		{/*</Group>}*/}

		<Group title="EventName">
			<Div>
				Краткое описание видоса и
				<Link>Link</Link>
			</Div>
		</Group>

		{fetchedUser  &&
		<Group>
			<FileSelector user_id={fetchedUser.id} access_token={access_token}/>
		</Group>}

		{fetchedUser  &&
		<Group>
			<PlayVideo/>
		</Group>}
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
