import { Form, Modal, Input } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@acme/shared-models";
import { ticketsAPI } from "client/src/apis";

interface TicketFormProps {
    isOpen: boolean;
    onClose: () => void;
    users: User[];
}

type FieldType = {
    description: string;
};

const TicketForm = ({ isOpen, onClose }: TicketFormProps): JSX.Element => {
    const [form] = Form.useForm();

    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (des: string) => ticketsAPI.createTicket(des),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
        onError: (error: string) => {
            console.error('Error creating ticket', error);
        }
    });


    const onFinish = (values: FieldType) => {
        createMutation.mutate(values.description);
        onClose();
    };

    return (
        <Modal
            title="Create Ticket"
            open={isOpen}
            okText="Save"
            cancelText="Cancel"
            onOk={() => form.submit()}
            onCancel={onClose}
        >
            <Form
                name="basic"
                initialValues={{ description: '' }}
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input description!' }]}
                >
                    <Input value={form.getFieldValue("description")} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default TicketForm;