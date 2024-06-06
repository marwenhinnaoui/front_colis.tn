import { Result, Button } from 'antd';

export default function NotFound(){
    return(
        <div style={{height:"100vh", display:"flex",flexDirection:'column', alignItems:"center",justifyContent:'center'}}>
            <Result
            status="404"
            title="404"
            />
            <h3>Sorry, the page you visited does not exist.</h3>
            <Button type="primary">Back Home</Button>
        </div>
    );
}