const crypto = require('crypto');

messageSchema.pre('save', function (next) {
  this.content = crypto.createCipher('aes-256-cbc', process.env.MESSAGE_SECRET)
    .update(this.content, 'utf8', 'hex');
  next();
});
