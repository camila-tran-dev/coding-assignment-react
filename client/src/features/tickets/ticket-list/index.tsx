import { Ticket, User } from "@acme/shared-models";
import TicketCard from "../ticket-card";
import { Col, Row } from "antd";

interface TicketListProps {
    tickets: Ticket[];
    users: User[];
}

const TicketList = ({ tickets, users }: TicketListProps) => {
    return (
        <>
            <Row gutter={[16, 16]}>
                {tickets?.map((ticket: Ticket) =>
                    <Col md={12} sm={24} lg={6} key={ticket.id} >
                        <TicketCard ticket={ticket} users={users} />
                    </Col>)
                }
            </Row>

            {tickets.length === 0 && <p>No tickets found</p>}
        </>
    )
};

export default TicketList;