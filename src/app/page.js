"use client";
import {
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  //All courses state
  const [courses, setCourses] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  //login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [authenUsername, setAuthenUsername] = useState(null);
  //my courses state
  const [myCourses, setMyCourses] = useState(null);

  const loadCourses = async () => {
    const resp = await axios.get("");
  };

  const loadMyCourses = async () => {
    const resp = await axios.get("/api/enrollment", {
      // headers: { Authorization: `Bearer ${token}` },
    });
    setMyCourses(resp.data.courses);
  };

  //load courses when app started
  useEffect(() => {
    loadCourses();
  }, []);

  //load my courses when logged in
  useEffect(() => {
    if (!token) return;

    loadMyCourses();
  }, [token]);

  const login = async () => {
    try {
      const resp = await axios.post("/api/user/login");
      //set token and authenUsername here
      // setToken();
      // setAuthenUsername();
      // setUsername("");
      // setPassword("");
    } catch (error) {
      //show error message from API
      if (error.response.data) {
        alert(error.response.data.message);
      } else {
        //show other error message
        alert(error.message);
      }
    }
  };

  const logout = () => {
    //set stuffs to null
  };

  return (
    <Container size="sm">
      <Title italic align="center" color="violet" my="xs">
        Course Enrollment
      </Title>
      <Stack>
        {/* all courses section */}
        <Paper withBorder p="md">
          <Title order={4}>All courses</Title>
          {/* <Loader variant="dots" /> */}
          {courses &&
            courses.map((course) => (
              <Text key={course.courseNo}>
                {course.courseNo} - {course.title}
              </Text>
            ))}
        </Paper>

        {/* log in section */}
        <Paper withBorder p="md">
          <Title order={4}>Login</Title>

          {/* show this if not logged in yet */}
          <Group align="flex-end">
            <TextInput
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <TextInput
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button onClick={login}>Login</Button>
          </Group>

          {/* show this if logged in already */}
          {/* <Group>
              <Text fw="bold">Hi {authenUsername}!</Text>
              <Button color="red" onClick={logout}>
                Logout
              </Button>
            </Group> */}
        </Paper>

        {/* enrollment section */}
        <Paper withBorder p="md">
          <Title order={4}>My courses</Title>
          <Text color="dimmed">Please login to see your course(s)</Text>

          {myCourses &&
            myCourses.map((course) => (
              <Text key={course.courseNo}>
                {course.courseNo} - {course.title}
              </Text>
            ))}
        </Paper>
      </Stack>
    </Container>
  );
}
