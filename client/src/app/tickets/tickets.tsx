import styles from './tickets.module.css';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Col, Row, Select, Space, Spin } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';

import { Ticket, User } from '@acme/shared-models';
import { ticketsAPI, usersAPI } from 'client/src/apis';

import { TicketForm, TicketList } from 'client/src/features/tickets';

export function Tickets() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { data: tickets, isLoading: isTicketLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: () => ticketsAPI.getTickets(),
    initialData: []
  });

  const { data: users, isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers(),
    initialData: [],
  });

  const [filter, setFilter] = useState<boolean | null>(null);

  const filterTickets = useMemo(() => {
    return filter === null ? tickets : tickets.filter(ticket => ticket.completed === filter);
  }, [filter, tickets]);

  const onChange = (value: boolean) => {
    setFilter(value);
  };

  const onOpenModal = () => {
    setIsOpenModal(true);
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
  };

  if (isTicketLoading || isUsersLoading) {
    return <Spin tip="Loading..." />;
  }


  return (
    <div className={styles['tickets']}>
      <h2>Tickets</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }} >
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>

          <Space>
            <FilterOutlined />
            <Select
              value={filter}
              placeholder="Filter "
              optionFilterProp="label"
              onChange={onChange}
              style={{ width: 150 }}
              options={[
                {
                  value: null,
                  label: 'All',
                },
                {
                  value: true,
                  label: 'Complete',
                },
                {
                  value: false,
                  label: 'Incomplete',
                },
              ]}
            />
          </Space>

          <Button type="primary" onClick={onOpenModal} icon={<PlusOutlined />}>Create Ticket</Button>
        </Row>

        <TicketList tickets={filterTickets ?? []} users={users} />
      </Space>

      {isOpenModal && <TicketForm onClose={onCloseModal} users={users} isOpen={isOpenModal} />}
    </div >
  );
}

export default Tickets;
