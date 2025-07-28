"use client";
import axios from "axios";
import React, { useEffect } from "react";

export default function AccountForm() {
  const [profile, setProfile] = React.useState(null);
  const fetchProfile = async () => {
    const response = await axios.get("/api/profiles");
    if (response.data.success) {
      setProfile(response.data.data);
      return response.data.data;
    }
  };
  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        console.log("Profile:", profile);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}
