const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');


const agents = [{
  code: "A001",
  name: "sarawut",
  status: "Available",
  pasword: "sdsda55850456@sda",
  ID: "dsdsf0531dfdf023df5",
}, {
  code: "A002",
  name: "sarawin",
  status: "on",
  pasword: "sd878750456@da",
  ID: "dsdsf0531dfdf023df5",
}, {
  code: "A003",
  name: "saranut",
  status: "off",
  pasword: "sd0456@sda",
  ID: "dsdsfdfdsf1535",
}];

app.use(express.json());
app.use(cors());


function validateStatus(status) {
  const validStatuses = ["Available", "Active", "Wrap Up", "Not Ready", "Offline"];
  return validStatuses.includes(status);
}

app.patch('/api/agents/:code/status', (req, res) => {
  const agentCode = req.params.code;
  const newStatus = req.body.status;

  const agent = agents.find(a => a.code === agentCode);
  if (!agent) {
    return res.status(404).json({
      success: false,
      message: `Agent with code ${agentCode} not found`
    });
  }

  if (!newStatus) {
    return res.status(400).json({
      success: false,
      message: `Missing 'status' field in request body`
    });
  }

  if (!validateStatus(newStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: Available, Active, Wrap Up, Not Ready, Offline`
    });
  }


  const oldStatus = agent.status;
  agent.status = newStatus;

  res.json({
    success: true,
    message: `Status updated successfully`,
    data: {
      code: agent.code,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/agents', (req, res) => {
  res.json({
    success: true,     // เติม true/false
    data: agents,        // เติม agents หรือไม่?
    count: 3,       // เติมจำนวน agents
    timestamp: new Date().toISOString()
  });
});

app.get('/api/agents/count', (req, res) => {
  res.json({
    success: true,
    count: agent.length,
    timestamp: new Date().toISOString()
  });
});


app.get('/health', (req, res) => {
  res.json({
    "status": "OK",
    "timestamp": new Date().toISOString()
  });
});


app.get('/api/dashboard/stats', (req, res) => {
  // ขั้นที่ 1: นับจำนวนรวม
  const totalAgents = agents.length; // เติม

  // ขั้นที่ 2: นับ Available agents
  const available = agents.filter(a => a.status === "Available").length; // เติม
  const active = agents.filter(a => a.status === "active").length; // เติม
  const wrapUp = agents.filter(a => a.status === "wrap Up").length; // เติม
  const notReady = agents.filter(a => a.status === "not Ready").length; // เติม
  const offline = agents.filter(a => a.status === "offline").length; // เติม
  // ให้นักศึกษาเขียน active, wrapUp, notReady, offline เอง

  // ขั้นที่ 3: คำนวณเปอร์เซ็นต์  
  const availablePercent = (count) => totalAgents > 0 ? Math.round((count / totalAgents) * 100) : 0;

  // ให้นักศึกษาทำส่วนอื่นเอง...
  res.json({
    success: true,
    data: {
        total: totalAgents,
        statusBreakdown: {
            available: { count: available, percent: availablePercent(available) },
            active: { count: active, percent: availablePercent(active) },
            wrapUp: { count: wrapUp, percent: availablePercent(wrapUp) },
            notReady: { count: notReady, percent: availablePercent(notReady) },
            offline: { count: offline, percent: availablePercent(offline) }
        },
        timestamp: new Date().toISOString()
    }
})
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});