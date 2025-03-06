"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function HR() {
  const { status } = useSession();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [isActive, setIsActive] = useState(false);
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
    if (name && designation && joiningDate && salary) {
      const newRecord = { 
        id: data.length + 1, 
        name, 
        designation, 
        joiningDate, 
        salary, 
        isActive: isActive ? "Yes" : "No" 
      };

      setData((prevData) => {
        const updatedData = [...prevData, newRecord];
        console.log("Updated Data:", updatedData); 
        return updatedData;
      });

      setName(""); 
      setDesignation("");
      setJoiningDate("");
      setSalary("");
      setIsActive(false); 
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "joiningDate", headerName: "Joining Date", width: 200 },
    { field: "salary", headerName: "Salary", width: 150 },
    { field: "isActive", headerName: "Is Active", width: 150 },
  ];

  if (status === "loading") return <p>Loading...</p>;

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={handleLogout} sx={{ marginBottom: 2 }}>
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
      />
      <TextField
        label="Designation"
        value={designation}
        onChange={(e) => setDesignation(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Joining Date"
        type="date"
        value={joiningDate}
        onChange={(e) => setJoiningDate(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        InputLabelProps={{
          shrink: true, 
        }}
      />
      <TextField
        label="Salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
        type="number"
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
  );
}
