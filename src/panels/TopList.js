import {
    Panel,
    ListItem,
    Button,
    Group,
    Div,
    Avatar,
    InfoRow,
    Link,
    Cell,
    List,
    Progress,
    Tabs,
    TabsItem,
    FixedLayout,
    View, PanelHeader, Epic
} from '@vkontakte/vkui';
import React from 'react';
import Home from "./Home";
import TaskList from "./TaskList";
import PlayVideo from "./PlayVideo";

class TopList extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            activeTab: 'friends'
        };

    }


    render () {
        var content = function (){if(this.state.activeTab==='friends'){
            return <View id="friends" activeTab="friends">
                    <Div>Рас</Div>
            </View>
        } else {
            return <View id="world" activeTab="world">
                    <Div>Два</Div>
            </View>
        }}

        return (
                <Div id="tabs">

                    <FixedLayout vertical="top" activeTab={this.state.activeTab}>
                        <Tabs theme="header" >
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'friends' })}
                                selected={this.state.activeTab === 'friends'}
                            >
                                Друзья
                            </TabsItem>
                            <TabsItem
                                onClick={() => this.setState({ activeTab: 'world' })}
                                selected={this.state.activeTab === 'world'}
                            >
                                Мир
                            </TabsItem>

                        </Tabs>
                        <View id="world" activeTab="world">
                            <Group>
                                <List>
                                    <Cell before={<Avatar/>} description="Event">Иван Иванов 87% <PlayVideo/></Cell>
                                    <Cell before={<Avatar/>} description="Event">Robbie Williams 78% <PlayVideo/></Cell>
                                    <Cell before={<Avatar/>} description="Event">Иосиф Сталин 66% <PlayVideo/></Cell>
                                </List>
                            </Group>
                        </View>
                    </FixedLayout>

                </Div>
        )
    }
}

export default TopList