import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { View } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			fetchedUser: null,
		};
	}

	componentDidMount() {
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppAccessTokenReceived':
					let { access_token } = e.detail.data;
					this.setState({ accessToken: access_token });
					alert("handle accessToken" + access_token);
					break;
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					break;
				case 'VKWebAppCallAPIMethodResult':
					this.setState({ url: e.detail.data });
					console.log(e.detail.data.response);
					break;
				default:
					console.log(e.detail.type);
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

	render() {
		return (
			<View activePanel={this.state.activePanel}>
				<Home id="home" fetchedUser={this.state.fetchedUser}  access_token={this.state.accessToken} go={this.go} />
			</View>
		);
	}
}

export default App;
