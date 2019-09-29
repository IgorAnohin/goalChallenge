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
    Footer,
    PanelHeader
} from '@vkontakte/vkui';
import React from 'react';

const TasksList = ({ id, go, fetchedUser, access_token }) =>(
    <Div id={id}>
        <Group >
            <Div>
                “Помни историю” совместно с <Link>1хNet</Link>
                Повтотри знаменитые мировые голы, и узнай насколько близко ты смог исполнить удар, который навсегда останется в сердце болельщиков
            </Div>
        </Group>
        <Group>
            <Div>
                <InfoRow title="Прогресс">
                    <Progress value={40} />
                </InfoRow>
            </Div>
        </Group>
        <Group title="Задания">
            <List>
                <Cell description="Греция 2002">Дэвид Бэкхем</Cell>
                <Cell description="Музыкант">Robbie Williams</Cell>
                <Cell description="Издательский дом">ПостНаука</Cell>
            </List>
        </Group>
        <Footer>Пока заданий больше нет</Footer>
    </Div>
);
export default TasksList