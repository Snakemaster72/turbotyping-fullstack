import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VerifyEmailPage = () => {
  const { theme } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.post(`/api/users/verify-email/${token}`);
        setVerificationStatus('success');
        toast.success(response.data.message);
        setTimeout(() => navigate('/auth/login'), 3000);
      } catch (error) {
        setVerificationStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          title: 'Verifying your email...',
          message: 'Please wait while we verify your email address.',
          icon: null
        };
      case 'success':
        return {
          title: 'Email Verified!',
          message: 'Your email has been verified successfully. Redirecting to login...',
          icon: <FiCheckCircle className="w-16 h-16" style={{ color: theme.primary }} />
        };
      case 'error':
        return {
          title: 'Verification Failed',
          message: 'We could not verify your email. The link may be invalid or expired.',
          icon: <FiXCircle className="w-16 h-16" style={{ color: '#fb4934' }} />
        };
      default:
        return {
          title: 'Unknown Status',
          message: 'Something went wrong.',
          icon: null
        };
    }
  };

  const content = renderContent();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 font-jetbrains"
      style={{ 
        backgroundColor: theme.bg,
        color: theme.text
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg border-2 text-center"
        style={{
          backgroundColor: theme.bgDark,
          borderColor: theme.border
        }}
      >
        {content.icon && (
          <div className="flex justify-center mb-6">
            {content.icon}
          </div>
        )}
        
        <h1 
          className="text-3xl font-bold mb-4"
          style={{ color: theme.primary }}
        >
          {content.title}
        </h1>
        
        <p style={{ color: theme.textSoft }}>
          {content.message}
        </p>

        {verificationStatus === 'error' && (
          <button 
            onClick={() => navigate('/auth/login')}
            className="mt-6 py-2 px-4 rounded transition-colors"
            style={{ 
              backgroundColor: theme.primary,
              color: theme.bg
            }}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
