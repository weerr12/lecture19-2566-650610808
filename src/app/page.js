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
  // courses ไว้เก็บตัวแปรรายวิชาต่างๆ ที่จะไปแสดงใน all courses มี 2 สถานะ ตอนที่โหลดข้อมูลเสร็จแล้ว กับยังไม่ได้โหลดข้อมูล(null)
  const [courses, setCourses] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  //login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // ได้ token ก็ต่อเมื่อ login เรียบร้อย
  const [token, setToken] = useState(null);
  // เก็บ username ที่ login เรียบร้อยแล้วใน -> authenUsername
  const [authenUsername, setAuthenUsername] = useState(null);
  //my courses state
  const [myCourses, setMyCourses] = useState(null);

  // courses ถูกใช้ตรงนี้
  const loadCourses = async () => {
    // ตอนที่มันเริ่ม Load ก็เซตให้มันเป็น true ไปดิ
    setLoadingCourses(true);
    // axios เอาไว้ดึง api มา ตาม route ที่ใส่ -> /api/course
    // ตรงนี้เป็นแบบ [.get]
    // คราวก่อนใช้ www.randomuser.com //
    // แต่ตอนนี้ใช้ /api/course เพราะ react จะเอาไป resoup ด้วยตัวเอง localhost:3000/api/course
    // 1.ข้างล่างตรงนี้ เรียกใช้ api
    const resp = await axios.get("/api/course");
    // 2.เก็บค่ารายวิชา -> (ด้วยสิ่งที่ได้กลับคืนมา)
    setCourses(resp.data.courses);
    /*
    {
      -> resp ของ api หน้าตาเป็นแบบนี้
      -> การที่จะดึง resp จาก api มาใช้ ใช้คำสั่ง resp.data ทั้งก้อนข้างล่าง, .courses คือ เข้าถึงแค่ courses
      ok:true,
      courses:[
        {courseNo: ..., title:...},
        {courseNo: ..., title:...},
      ]
    }
    */
    //  เวลามันโหลดเซตไม่ว่าผลลัพธ์จะเป็นอะไรก็ตาม เซต loading ให้เป็น false
    setLoadingCourses(false);
  };
  // 3. my courses โชวืวิชาที่ลงทะเบียนไปแล้ว
  const loadMyCourses = async () => {
    // 1.axios.get เอาไว้ดึง api มา ตาม route ที่ใส่ -> /api/enrollment
    const resp = await axios.get("/api/enrollment", {
      // 2.ต้องแนบ token ด้วย ด้านล่างนี้
      headers: { Authorization: `Bearer ${token}` },
    });
    // 3.พอ get มาแล้วก็เก็บไว้ใน usestate อีกอันคือ myCourses
    setMyCourses(resp.data.courses);
  };

  // useEffect ใช้เพื่อเอาไว้ รันโค้ดอะไรบางอย่างตามเงื่อนไขที่เรากำหนด
  //load courses when app started
  useEffect(() => {
    loadCourses();
    // ตอนแอพเปิดขึ้นมาเช็คว่ามี username กับ token ใน localStorage มั้ย
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    // เช็คว่ามีค่าอยู่มั้ย
    if (token && username) {
      // ถ้ามีค่าให้ set token , username ลง usestate -> จะได้ไม่ต้อง login ใหม่
      setToken(token);
      setAuthenUsername(username);
    }
  }, []);

  //load my courses when logged in
  // run when "token" is changed"
  useEffect(() => {
    if (!token) return;

    loadMyCourses();
  }, [token]);

  // ฟังก์ชั่น login
  // 1.axios เอาไว้ดึง api มา ตาม route ที่ใส่ -> /api/course
  // ตรงนี้เป็นแบบ [.post] -> route login ต้องส่ง request body ไปด้วย
  const login = async () => {
    try {
      const resp = await axios.post("/api/user/login", {
        // -> 2.route login ต้องส่ง request body ไปด้วย -> username,password -> เป็นแบบ usestate
        username,
        password,
      });

      //set token and authenUsername here
      // 3.login สำเร็จก็เก็บค่า token ไว้ -> resp.data.token
      setToken(resp.data.token);
      // 4.แล้วก็เก็บค่า Username ไว้ด้วย -> resp.data.username
      setAuthenUsername(resp.data.username);
      // 5.เคลียร์ input ทั้งสอง พอกด Login ปุบให้มันลบไป
      setUsername("");
      setPassword("");
      // ให้มันบันทึก token ลง localStorage
      localStorage.setItem("token", resp.data.token);
      // ให้มันบันทึก username ลง localStorage
      localStorage.setItem("username", resp.data.username);
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
  // ฟังก์ชั่น logout
  const logout = () => {
    //set stuffs to null
    // 1.เวลากด logout ก็เซตค่าให้ตัวแปรต่างๆเป็น null
    setAuthenUsername(null);
    setToken(null);
    setMyCourses(null);
    // เวลา logout แล้วกด F5 ก็ให้มันลบที่เก็บไว้ใน local ทิ้งไป
    localStorage.removeItem("token");
    localStorage.removeItem("username");
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
          {/* ให้โชว์ว่ามันขึ้น ... เวลา F5 ใหม่ */}
          {loadingCourses && <Loader variant="dots" />}
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

          {/* show this if not logged in yet แสดงว่าเมื่อ login เสร็จให้ซ่อนกล่องไปเลยแล้วขึ้นว่า login สำเร็จ */}
          {/* ถ้ามันไม่มีค่าอะไร หรือ null -> !authenUsername */}
          {!authenUsername && (
            <Group align="flex-end">
              {/* TextInput ไว้รอรับค่า username,password ที่จะพิมพ์เข้าไป */}
              <TextInput
                label="Username"
                // ผูกกับ usestate ไว้ ชื่อ username,password
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <TextInput
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {/* เวลากดปุ่มก็จะไปเรียกใช้ฟังก์ชั่น login บรรทัด 70 กว่าๆ */}
              <Button onClick={login}>Login</Button>
            </Group>
          )}

          {/* show this if logged in already */}
          {/* ถ้ามันมีค่าก็ให้แสดง -> authenUsername */}
          {authenUsername && (
            <Group>
              <Text fw="bold">Hi {authenUsername}!</Text>
              <Button color="red" onClick={logout}>
                Logout
              </Button>
            </Group>
          )}
        </Paper>

        {/* enrollment section */}
        <Paper withBorder p="md">
          <Title order={4}>My courses</Title>
          {/* เช็คว่ายังไม่มีใช่มั้ย ถ้าใช่ให้โชว์ข้อความข่างล่าง  -> !authenUsername*/}
          {!authenUsername && (
            <Text color="dimmed">Please login to see your course(s)</Text>
          )}

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
