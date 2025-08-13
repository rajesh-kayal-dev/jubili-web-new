'use client';

import { useState } from 'react';
import CustomButton from '@/components/ui/CustomButton';
import { useToastActions } from '@/hooks/useToastActions';
import Navbar from '@/components/layout/Navbar';

export default function Home() {
  const { showSuccess, showError, showWarning, showInfo, showToastWithAction } = useToastActions();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    
      showToastWithAction(
        'info',
        'Interactive Toast',
        'Click the action button to see what happens!',
        'Try Me',
        () => {
          showSuccess('Great job!', 'You found the hidden success message 🎉');
        },
        1000
      );
    
    setLoading(false);
  };

  return (
    <>
      <main style={{ padding: "2rem", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        {loading && <p>Loading...</p>}
        <CustomButton
          onClick={handleClick}
          label="Click Me"
          loading={loading}
        />
      </main>
      <Navbar />
    </>
  );
}
