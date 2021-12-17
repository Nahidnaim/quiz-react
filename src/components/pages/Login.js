// import css
import classes from "../../styles/Login.module.css";
// import components
import Illustration from "../Illustration";
import Form from "../Form";
import TextInput from "../TextInput";
import Button from "../Button";

export default function Signup() {
  return (
    <>
      <h1>Login to your account</h1>
      <div class="column">
        <Illustration />
        <Form className={`${classes.login}`}>
          <TextInput
            type="email"
            placeholder="Enter emaail"
            icon="alternate_email"
          />
          <TextInput type="password" placeholder="Enter password" icon="lock" />
          <Button>
            <span>Login</span>
          </Button>

          <div className="info">
            Don't have an account? <a href="login.html">Signup</a> now.
          </div>
        </Form>
      </div>
    </>
  );
}
