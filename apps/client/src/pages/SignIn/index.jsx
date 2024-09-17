import { UsernamePasswordForm } from '@root/shared/components/UsernamePasswordForm';
import { useMutation } from "@tanstack/react-query";
import { api } from "@root/shared/api";
import { useAuthContext } from "@root/context/auth/AuthContext";
import { setSession } from "@root/shared/session";
import { useSearchParams, useNavigate } from "react-router-dom";
import { routes } from "@root/routes/routes.js";

export const SignIn = () => {
    const { signIn } = useAuthContext()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const signInMutation = useMutation({
        mutationFn: api.auth.signIn,
        onSuccess:(data) => {
            setSession(data.accessToken, data.refreshToken);
            signIn(data.user);
            navigate(searchParams.get('loginFrom') || routes.lootBoxes);
        }
    });
    const onSubmit = (username, password) => {
        signInMutation.mutate({username, password})
    }
    return (
        <UsernamePasswordForm
            onSubmit={onSubmit}
            title="Sign in to Application"
        />
    );
};
