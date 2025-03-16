import { useNavigate } from 'react-router-dom';
import { Avatar, Card, Space, Tag, Row, Col } from "antd";
import { UserOutlined, CheckOutlined, Loading3QuartersOutlined, MoreOutlined } from '@ant-design/icons';

import { Ticket, User } from '@acme/shared-models';

import styles from './ticket-card.module.css';

interface TicketCardProps {
    ticket: Ticket;
    users: User[];
}

const TicketCard = ({ ticket, users }: TicketCardProps): JSX.Element => {
    const router = useNavigate();

    const goToDetailPage = () => {
        router(`/${ticket.id}`);
    };

    const actions = [
        <MoreOutlined key="view" />
    ]

    const assignee = users.find(user => user.id === ticket.assigneeId);

    return (
        <Card style={{ minWidth: 300, height: '100%' }} actions={actions} onClick={goToDetailPage} className={styles['card']}>
            <Card.Meta
                avatar={
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                }
                title={
                    <Row justify="space-between" align="middle" gutter={4}>
                        <Col span={21} className={styles['description']}>
                            <span>[ID: #{ticket.id}] - {ticket.description}</span>
                        </Col>
                        <Col span={3}>
                            {ticket.completed ? <Tag color="green"><CheckOutlined /></Tag> : <Tag color="red"><Loading3QuartersOutlined /></Tag>}
                        </Col>
                    </Row>
                }
                description={
                    <Space>
                        <UserOutlined />
                        <span> {assignee?.name ? `By ${assignee.name}` : 'Unassigned'} </span>
                    </Space>
                }
            />
        </Card >
    );
}

export default TicketCard;