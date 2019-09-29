import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View, Panel, PanelHeader, Epic, Tabbar, TabbarItem} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import Icon28Notifications from "@vkontakte/icons/dist/28/notifications";


import Home from './panels/Home';
import TaskList from './panels/TaskList'
import Cup from './panels/Cup'
import TopList from "./panels/TopList";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			fetchedUser: null,
			activeStory: 'home',
		};
		this.onStoryChange = this.onStoryChange.bind(this);

	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					let { access_token } = e.detail.data;
					this.setState({ accessToken: access_token });
					break;
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				case 'VKWebAppCallAPIMethodResult':
					this.setState({ url: e.detail.data });
					// console.log(e.detail.data.response);
					break;
				default:
					// console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
		// connect.send("VKWebAppGetAuthToken", {});
		connect.send("VKWebAppGetAuthToken", {"app_id": 7108273, "scope": "stories"});
		// connect.send("VKWebAppCallAPIMethod",{"method": "stories.getVideoUploadServer", "request_id": "32test", "params": {"add_to_news": "1", "v":"5.101", "access_token":access_token}});





	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};
	onStoryChange (e) {
		this.setState({ activeStory: e.currentTarget.dataset.story })
	}

	render() {
		return (
			<Epic activeStory={this.state.activeStory} tabbar={
				<Tabbar>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'home'}
						data-story="home"
						text="Главная"
					><Icon28Notifications /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'tasks'}
						data-story="tasks"
						text="Задачи"
					><Icon28Notifications /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'top'}
						data-story="top"
						text="Топ"
					><Icon28Notifications /></TabbarItem>
					<TabbarItem
						onClick={this.onStoryChange}
						selected={this.state.activeStory === 'cup'}
						data-story="cup"
						text="Кубок"
					><Icon28Notifications /></TabbarItem>
				</Tabbar>
			}>
				<View id="home" activePanel="home">
					<Panel id="home">
						<PanelHeader>HOME</PanelHeader>
						<Home id="home" fetchedUser={this.state.fetchedUser}  access_token={this.state.accessToken} go={this.go} />
					</Panel>
				</View>
				<View id="tasks" activePanel="tasks">
					<Panel id="tasks">
						<PanelHeader>Tasks</PanelHeader>
						<TaskList id="tasks"/>
					</Panel>
				</View>
				<View id="top" activePanel="top">
					<Panel id="top">
						<PanelHeader>Топ</PanelHeader>
						<TopList />
					</Panel>
				</View>
				<View id="cup" activePanel="cup">
					<Panel id="cup">
						<PanelHeader>Кубок</PanelHeader>
						<Cup id="cup" fetchedUser={this.state.fetchedUser} access_token={this.state.accessToken} go={this.go}/>

					</Panel>
				</View>
				{/*<View id="season" activePanel="season">*/}
				{/*	<Panel id="season">*/}
				{/*		<PanelHeader>Сезон</PanelHeader>*/}
				{/*	</Panel>*/}
				{/*</View>*/}
			</Epic>
			// <View activePanel={this.state.activePanel}>
			// 	<Home id="home" fetchedUser={this.state.fetchedUser}  access_token={this.state.accessToken} go={this.go} />
			// </View>
		);
	}
}

export default App;
