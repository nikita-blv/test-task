import { Button, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Input } from '@root/shared/components/Input';
import { useFormInput } from '@root/shared/hooks/useFormInput';
import { AppContainer } from '@root/shared/components/AppContainer.jsx';

const AuthPageContainer = styled('form')`
    max-width: 400px;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const AuthCard = styled(Card)`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    flex-grow: 1;
`;

export const UsernamePasswordForm = ({ onSubmit, title }) => {
    const usernameInput = useFormInput();
    const passwordInput = useFormInput();
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(usernameInput.value, passwordInput.value);
    };
    return (
        <AppContainer>
            <AuthPageContainer onSubmit={handleSubmit}>
                <AuthCard>
                    <Typography>{title}</Typography>
                    <Input
                        label="username"
                        value={usernameInput.value}
                        onChange={usernameInput.onChange}
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={passwordInput.value}
                        onChange={passwordInput.onChange}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </AuthCard>
            </AuthPageContainer>
        </AppContainer>
    );
};
