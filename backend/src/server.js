const express = require('express');
const cors = require('cors');
const staffRoutes = require('./routes/staffRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/staff', staffRoutes);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
