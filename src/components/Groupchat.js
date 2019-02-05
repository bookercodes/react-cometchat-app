import React from "react";
import { Redirect } from "react-router-dom";
import chat from "../lib/chat";

class Groupchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      receiverID: "",
      messageText: null,
      groupMessage: [],
      user: {},
      isAuthenticated: true
    };

    this.GUID = "supergroup";
  }

  send() {
    chat.sendGroupMessage(this.GUID, this.state.messageText).then(
      message => {
        console.log("Message sent successfully:", message);
        this.setState({ messageText: null });
        // this.update();
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );
  }

  scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.send();
    e.target.reset();
  };

  handleChange = e => {
    this.setState({ messageText: e.target.value });
  };


  getUser = () => {
    chat
      .getLoggedinUser()
      .then(user => {
        console.log("user details:", { user });
        this.setState({ user });
      })
      .catch(({ error }) => {
        if (error.code === "USER_NOT_LOGED_IN") {
          this.setState({
            isAuthenticated: false
          });
        }
      });
  };

  messageListener = () => {
    chat.addMessageListener((data, error) => {
      if (error) return console.log(`error: ${error}`);
      this.setState(prevState => ({
        groupMessage: [...prevState.groupMessage, data]
      }), () => {
        this.scrollToBottom();
      });
    });
  };

  componentDidMount() {
    this.getUser();
    this.messageListener();
  }

  render() {
    const { isAuthenticated } = this.state;
    if (!isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        <div className="chatWindow">
          <ul className="chat" id="chatList">
            {this.state.groupMessage.map((data, index) => (
              <div>
                {this.state.user.uid === data.sender.uid ? (
                  <li className="self" key={`${data.id}${index}`}>
                    <div className="msg">
                      <p>{data.sender.uid}</p>
                      <div className="message"> {data.data.text}</div>
                    </div>
                  </li>
                ) : (
                  <li className="other" key={`${data.id}${index}`}>
                    <div className="msg">
                      <p>{data.sender.uid}</p>
                      <div className="message"> {data.data.text} </div>
                    </div>
                  </li>
                )}
              </div>
            ))}
          </ul>
          <div className="chatInputWrapper">
            <form onSubmit={this.handleSubmit}>
              <input
                className="textarea input"
                type="text"
                placeholder="Type a message..."
                onChange={this.handleChange}
              />
            </form>

            <div className="emojis" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Groupchat;
