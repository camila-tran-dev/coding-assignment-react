import { User } from '@acme/shared-models';

const usersAPI = {
    getUsers: async (): Promise<User[]> => {
        const response = await fetch('/api/users');
        return response.json();
    },
};  

export { usersAPI };