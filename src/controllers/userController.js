const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { username, status, profilePicture } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (username) user.username = username;
    if (status) user.status = status;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.blockUser = async (req, res) => {
    try {
      const { blockedUserId } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Add to blockedUsers if not already blocked
      if (!user.blockedUsers.includes(blockedUserId)) {
        user.blockedUsers.push(blockedUserId);
        await user.save();
      }
      res.status(200).json({ message: 'User blocked' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.unblockUser = async (req, res) => {
    try {
      const { blockedUserId } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== blockedUserId);
      await user.save();
  
      res.status(200).json({ message: 'User unblocked' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  