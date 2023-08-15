import { useState } from "react";


interface User {
  id: string;
  name: string;
}
export const NewMessage = (props: { CREATOR: User, FAN: User, saveMessage: (fromUser: User, content: string) => void }) => {
  const [from, setFrom] = useState(props.CREATOR);
  const [content, setContent] = useState("");

  return <div style={{
    display: "flex",
    flexDirection: "column",
  }}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}>
      <label style={{ paddingRight: '4px' }}>From </label>
      <select onChange={
        (e) => {
          setFrom(e.target.value === props.CREATOR.id ? props.CREATOR : props.FAN)
        }
      }>
        <option value={props.CREATOR.id}>{props.CREATOR.name} (creator)</option>
        <option value={props.FAN.id}>{props.FAN.name} (fan)</option>
      </select>
    </div>
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <label>Content </label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
    <div style={{
      marginTop: "4px"
    }}>
      <button onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        props.saveMessage(from, content);
        setContent("");
      }}>Add Message</button>
    </div>
  </div>
}
