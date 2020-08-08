import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      login: null,
    };
  }

  componentDidMount() {
    this.storeCollector()
  }

  storeCollector() {
    let loginStore =  JSON.parse(localStorage.getItem('login'));

    if (loginStore) {
      this.setState({login: loginStore})
    }
  }
  
  login = (event) => {
    event.preventDefault();
    
    fetch('http://127.0.0.1:8000/api/login', {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      })
    }).then((response) => {
      response.json().then((result) => {
        if (result.error) {
          this.setState({
            login: {
              status: false,
              error: result.error
            }
          })
          console.warn('Error: ' + this.state.login.error)
        } else {
          localStorage.setItem('login', JSON.stringify({
            status: true,
            data: result
          }))
        }

        this.storeCollector()
      })
    })
  }

  logout = () => {
    this.setState({login: null})
    localStorage.clear()
  }
  
  post = () => {
    let token = 'Bearer ' + this.state.login.data.token;

    fetch('http://127.0.0.1:8000/api/book', {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
      })
    }).then((response) => {
      response.json().then((result) => {
        console.warn("Result", result)
      })
    })
  }
  
  render() {
    return (
      <div>
        {this.state.login && this.state.login.status ? (
            <div>
              <h3>You are logged in!</h3>
              <button onClick={this.post}>Get Book Data</button>
              <br></br>
              <button onClick={this.logout}>Logout</button>
            </div>
        ) : (
          <div>
            <h1>Login</h1>

            {this.state.login && this.state.login.error ? (
              <h4>{this.state.login.error}</h4>
            ) : (null)}

            <form method="post" onSubmit={this.login}>
              <input name="email" type="text" onChange={(event)=>{this.setState({email:event.target.value})}}></input>
              <input name="password" type="password" onChange={(event)=>{this.setState({password:event.target.value})}}></input>
              <input type="submit" />
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default App;
