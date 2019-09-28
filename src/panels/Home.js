import React from 'react';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader,Link } from '@vkontakte/vkui';

import PlayVideo from './PlayVideo';
import FileSelector from './FileSelector'

const Home = ({ id, go, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>Example</PanelHeader>
		{fetchedUser &&
		<Group title="User Data Fetched with VK Connect">
			<ListItem
				before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
				description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
			>
				{`${fetchedUser.first_name} ${fetchedUser.last_name}`}
			</ListItem>
		</Group>}

		<Group title="Navigation Example">
			<Div>
				Краткое описание ввидоса и
				<Link>Link</Link>
			</Div>
			{/*<Div>*/}
			{/*	<Button size="xl" level="2" onClick={go} data-to="persik">*/}
			{/*		Show me the Persik, please*/}
			{/*	</Button>*/}
			{/*</Div>*/}
		</Group>
		{fetchedUser &&

		<Group title="Видосик">
			<PlayVideo user={`${fetchedUser.id}`}/>
		</Group>}
		{fetchedUser &&
		<Group title="Повторить">
			<FileSelector user={`${fetchedUser.id}`}/>
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
