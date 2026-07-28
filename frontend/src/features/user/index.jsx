import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import UserProfile from './UserProfile';
import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="Profile" />
          <Tab label="Update Profile" />
          <Tab label="Change Password" />
        </Tabs>
      </Box>
      {activeTab === 0 && <UserProfile />}
      {activeTab === 1 && <UpdateProfile />}
      {activeTab === 2 && <ChangePassword />}
    </Box>
  );
};

export default UserProfilePage;