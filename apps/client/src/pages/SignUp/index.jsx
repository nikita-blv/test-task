import { UsernamePasswordForm } from '@root/shared/components/UsernamePasswordForm';
import { useMutation } from "@tanstack/react-query";
import { api } from "@root/shared/api";
import { useAuthContext } from "@root/context/auth/AuthContext";
import { setSession } from "@root/shared/session";

export const SignUp = () => {
    const { signIn } = useAuthContext()
    const signUpMutation = useMutation({
        mutationFn: api.auth.signUp,
        onSuccess:(data) => {
            signIn(data.user);
            setSession(data.accessToken, data.refreshToken);
        }
    });
    const onSubmit = (username, password) => {
        signUpMutation.mutate({username, password})
    }
    return (
        <UsernamePasswordForm
            onSubmit={onSubmit}
            title="Sign up to Application"
        />
    );
};
