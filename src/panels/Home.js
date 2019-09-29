import React from 'react';
import PropTypes from 'prop-types';
import { Panel, ListItem, Button, Group, Div, Avatar, PanelHeader,Link } from '@vkontakte/vkui';


import PlayVideo from './PlayVideo';
import FileSelector from './FileSelector'

const Home = ({ id, go, fetchedUser, access_token }) => (
	<Div id={id}>
		<Group title="Девид Бэкхем">
			<Div>
				<div>
					Знаменитый гол Девида Бекхема в ворота сборной Греции, выведший команду на мундиаль 2002 года. Проверь на сколько точно ты можешь повторить легендарный удар.
				</div>
				<div>Узнать подробнее о 7 лучших голах масетра шртафных  на </div>
				<Link href="https://www.sports.ru/tribuna/blogs/mama4h/2347644.html"> sports.ru</Link>
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
