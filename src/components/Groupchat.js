import React from 'react';
import chat from '../lib/chat';

class Groupchat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      receiverID: '',
      messageText: null,
      groupMessage: [],
      user: {}
    };

    this.GUID = 'supergroup';
  }


  componentDidMount() {
    this.getUser();
    this.update()
  }

  update() {
    chat.getGroupMessages(this.GUID, this.scrollToBottom).then(messages => {
      this.setState({ groupMessage: messages });
    })
      .catch(error => {
        console.log("Message fetching failed with error:", error);
      })
  }

  send() {
    chat.sendGroupMessage(this.GUID, this.state.messageText).then(
      message => {
        console.log("Message sent successfully:", message);
        this.setState({ messageText: null });
        this.update();
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );
  }

  scrollToBottom = () => {
    const chat = document.querySelectorAll(".chat")[0];
    chat.scrollTop = chat.scrollHeight;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.send();
    e.target.reset();
  }

  //get the chat message from the text box and update the state with the new value
  handleChange = (e) => {
    this.setState({ messageText: e.target.value });
  }

  // Get the current logged in user

  getUser = () => {
    chat.getLoggedinUser().then(user => {
      console.log("user details:", { user });
      this.setState({ user });
    },
    ).catch(error => {
      console.log("error getting details:", { error });
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="chatWindow">
          <ol className="chat">
            {this.state.groupMessage.map(data => (
              <div>
                {/* Render loggedin user chat at the right side of the page */}

                {this.state.user.uid === data.sender.uid ? (
                  <li className="self" key={data.id}>
                    <div className="msg">
                      <p>{data.sender.uid}</p>
                      <div className="message"> {data.data.text}</div>
                    </div>
                  </li>
                ) : (
                    // render loggedin users chat at the left side of the chatwindow
                    <li className="other" key={data.id}>
                      <div className="msg">
                        <p>{data.sender.uid}</p>
                        <div className="message"> {data.data.text} </div>
                      </div>
                    </li>
                  )}
              </div>
            ))}
          </ol>
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
