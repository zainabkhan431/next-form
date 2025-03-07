"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#fff", secondary: "#bbb" },
  },
});

export default function HR() {
  const { status } = useSession();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  const handleLogout = () => {
    signOut();
  };

  const handleCreate = () => {
    if (name && designation && joiningDate && salary && !salaryError) {
      const newRecord = { 
        id: data.length + 1, 
        name, 
        designation, 
        joiningDate, 
        salary, 
        isActive: isActive ? "Yes" : "No" 
      };

      setData((prevData) => [...prevData, newRecord]);

      setName(""); 
      setDesignation("");
      setJoiningDate("");
      setSalary("");
      setIsActive(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData((prevData) => prevData.filter((row) => row.id !== id));
    }
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSalary(value);
      setSalaryError(false);
    } else {
      setSalaryError(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "joiningDate", headerName: "Joining Date", width: 200 },
    { field: "salary", headerName: "Salary", width: 150 },
    { 
      field: "isActive", 
      headerName: "Is Active", 
      width: 150,
      renderCell: (params) => (
        <Checkbox checked={params.value === "Yes"} disabled />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)} color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  if (status === "loading") return <p>Loading...</p>;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, backgroundColor: "background.default", minHeight: "100vh", color: "text.primary" }}>
        <Button onClick={handleLogout} sx={{ marginBottom: 2 }} variant="contained" color="secondary">
          Logout
        </Button>

        <Typography variant="h4" gutterBottom>
          HR Page
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ style: { color: "#fff" } }}
        />
        <TextField
          label="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
          InputLabelProps={{ style: { color: "#fff" } }}
        />

        {/* Native Date Input */}
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Joining Date:
        </Typography>
        <input 
  type="date" 
  value={joiningDate} 
  onChange={(e) => setJoiningDate(e.target.value)} 
  style={{
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    cursor: "pointer"
  }} 
/>
        <TextField
          label="Salary"
          value={salary}
          onChange={handleSalaryChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          type="text"
          error={salaryError}
          helperText={salaryError ? "Salary must be a numeric value" : ""}
          InputLabelProps={{ style: { color: "#fff" } }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              name="isActive"
              color="primary"
            />
          }
          label="Is Active"
        />

        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{ marginBottom: 2 }}
        >
          Create
        </Button>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid rows={data} columns={columns} pageSize={5} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
