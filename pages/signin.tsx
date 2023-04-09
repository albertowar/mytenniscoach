import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import Router from 'next/router';
import { getURL } from '@/utils/helpers';
import { Copyright } from '@mui/icons-material';
import { Container, CssBaseline, Box, Avatar, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignUp = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (user) {
      Router.push('/dashboard');
    }
  }, [user]);

  if (!user) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Auth
            supabaseClient={supabaseClient}
            redirectTo={getURL()}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#404040',
                    brandAccent: '#52525b'
                  }
                }
              }
            }}
            theme="light"
          />
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      </Container>
    );
  }

  return <div>Loading</div>;
};

export default SignUp;