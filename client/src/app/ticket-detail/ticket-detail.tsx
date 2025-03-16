import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Select, Checkbox, CheckboxProps, Spin, Row, Avatar, Space, Col } from "antd";

import { ticketsAPI, usersAPI } from "client/src/apis";
import { Ticket, User } from "@acme/shared-models";

const { Meta } = Card;
const { Option } = Select;

export function TicketDetail() {
  const { id } = useParams();
  const ticketId = id ? Number(id) : null;
  if (!ticketId) {
    return <div style={{ textAlign: "center", color: "red" }}>Ticket not found</div>;
  }
  const [isCompleted, setIsCompleted] = useState<boolean>();

  const queryClient = useQueryClient();
  const { data: ticket, isLoading: isTicketLoading, error: isTicketError } = useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: () =>  ticketsAPI.getTicketDetail(ticketId),
    enabled: !!ticketId,
  })

  const { data: users, isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => usersAPI.getUsers(),
    initialData: []
  });

  const mutateAssign = useMutation({
    mutationFn: (assigneeId: number) => ticketsAPI.assignTicket(ticketId!, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    }
  });

  const mutateUnassign = useMutation({
    mutationFn: () => ticketsAPI.unassignTicket(ticketId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    }
  });

  const mutationStatus = useMutation({
    mutationFn: (isCompleted: boolean) =>
      isCompleted ? ticketsAPI.markComplete(ticketId) : ticketsAPI.markIncomplete(ticketId),
    onMutate: (value) => {
      return {
        ...ticket,
        completed: value
      }
    },
  });

  const onChangeAssign = (value: number) => {
    if (value) {
      mutateAssign.mutate(value);
    } else {
      mutateUnassign.mutate();
    }
  };

  const onChangeStatus: CheckboxProps["onChange"] = (e) => {
    const newValue = e.target.checked;
    setIsCompleted(newValue);
    mutationStatus.mutate(newValue);
  };

  useEffect(() => {
    if (ticket?.id) {
      setIsCompleted(ticket.completed);
    }
  }, [ticket]);


  if (isTicketLoading || isUsersLoading) {
    return <Spin tip="Loading..." />;
  }

  if (isTicketError) {
    return <div style={{ textAlign: "center", color: "red" }}>Error loading ticket.</div>;
  }

  return (
    <div>
      <h2>Tickets Detail</h2>
      <Row justify="center">
        <Card
          style={{ width: 400 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }>

          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
            title={
              ticket?.description ? (
                <Space direction="vertical" style={{ width: "100%", gap: 8 }}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <Checkbox checked={isCompleted} onChange={onChangeStatus} />
                    </Col>
                    <Col flex="auto">
                      <span style={{ fontWeight: 500 }}>{ticket.description}</span>
                    </Col>
                  </Row>

                  <Row align="middle" style={{ gap: 8 }}>
                    <UserOutlined style={{ fontSize: 16, color: "#888" }} />
                    <Select
                      style={{ flex: 1, minWidth: 150 }}
                      placeholder="Select a user"
                      onChange={onChangeAssign}
                      allowClear
                      value={ticket.assigneeId ?? undefined}
                    >
                      {[...users, { id: null, name: "Unassign" }].map((user) => (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      ))}
                    </Select>
                  </Row>
                </Space>
              ) : (
                <div style={{ textAlign: "center", fontSize: "14px", color: "#888" }}>
                  No ticket found
                </div>
              )
            }
          />
        </Card>
      </Row>
    </div>

  );
}

export default TicketDetail;
