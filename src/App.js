import React, { Component } from "react";

import "./App.css";

import beep from "./beep.mp3";

///https://www.freesoundeffects.com/  source of the sound effect

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //always changing during the run, displayed in the app
      timeLeft: 1500,
      //changes during the change from session to break and break to session
      //used to give proper time to setInterval functions
      initialTime: 1500,
      //doesn't change during the run
      session: 1500,
      //doesn't change during the run
      break: 300,
      ///displays Session or Break
      stringToDisplay: "Session",
      // if true: start/pause acts as start, if false it acts as a pause
      startIfTrue: true,
      //session and break times can be changed if true
      //initial state: true -> start-button: false -> reset btn:true
      changeTimesIfTrue: true
    };

    this.sessionMinus = this.sessionMinus.bind(this);
    this.sessionPlus = this.sessionPlus.bind(this);
    this.breakMinus = this.breakMinus.bind(this);
    this.breakPlus = this.breakPlus.bind(this);

    this.timerStart = this.timerStart.bind(this);
    this.timerStartWithoutButton = this.timerStartWithoutButton.bind(this);
    this.breakStart = this.breakStart.bind(this);
    this.breakStartWithoutButton = this.breakStartWithoutButton.bind(this);

    this.buttonToggle = this.buttonToggle.bind(this);
    this.reset = this.reset.bind(this);

    this.audio01 = new Audio(beep);
  }

  sessionMinus() {
    if (!this.state.changeTimesIfTrue) {
      return;
    }

    if (this.state.timeLeft > 60) {
      this.setState({
        timeLeft: this.state.timeLeft - 60,
        initialTime: this.state.initialTime - 60,
        session: this.state.session - 60
      });
    }
  }

  sessionPlus() {
    if (!this.state.changeTimesIfTrue) {
      return;
    }

    if (this.state.timeLeft <= 3540) {
      this.setState({
        timeLeft: this.state.timeLeft + 60,
        initialTime: this.state.initialTime + 60,
        session: this.state.session + 60
      });
    }
  }

  breakMinus() {
    if (!this.state.changeTimesIfTrue) {
      return;
    }

    if (this.state.break > 60) {
      this.setState({ break: this.state.break - 60 });
    }
  }

  breakPlus() {
    if (!this.state.changeTimesIfTrue) {
      return;
    }

    if (this.state.break <= 3540) {
      this.setState({ break: this.state.break + 60 });
    }
  }

  // run after initiall start|pause btn is clicked, as well as if start|pause is clicked after pausing
  // and during the 'session' mode
  timerStart() {
    ///works only if the program is in the session mode
    if (this.state.stringToDisplay !== "Session") {
      return;
    }

    /// preventing another execution if btn is in pause mode
    if (!this.state.startIfTrue) {
      return;
    }

    if (this.state.timeLeft >= -1) {
      this.setState({
        interval: setInterval(
          () => this.setState({ timeLeft: this.state.timeLeft - 1 }),
          1000
        )
      });

      this.setState({
        clearingInterval: setTimeout(() => {
          clearInterval(this.state.interval);
        }, (this.state.initialTime + 1) * 1000)
      });

      this.setState({
        audio: setTimeout(() => {
          this.audio01.play();
        }, (this.state.initialTime + 1) * 1000)
      });

      this.setState({
        breakStarting: setTimeout(() => {
          this.breakStartWithoutButton();
        }, (this.state.initialTime + 1) * 1000)
      });
    }
  }

  // works after break (click does not trigger it)
  timerStartWithoutButton() {
    this.setState({ stringToDisplay: "Session" });

    if (this.state.timeLeft >= -1) {
      this.setState({
        timeLeft: this.state.session,
        initialTime: this.state.session
      });

      this.setState({
        interval: setInterval(
          () => this.setState({ timeLeft: this.state.timeLeft - 1 }),
          1000
        )
      });

      this.setState({
        clearingInterval: setTimeout(() => {
          clearInterval(this.state.interval);
        }, (this.state.initialTime + 1) * 1000)
      });

      this.setState({
        audio: setTimeout(() => {
          this.audio01.play();
        }, (this.state.initialTime + 1) * 1000)
      });

      this.setState({
        breakStarting: setTimeout(() => {
          this.breakStartWithoutButton();
        }, (this.state.initialTime + 1) * 1000)
      });
    }
  }

  // works when clicking Start|Reset btn after pausing if the timer is in the break mode
  breakStart() {
    ///works only if the program is in the break mode
    if (this.state.stringToDisplay !== "Break") {
      return;
    }

    /// preventing another execution if btn is in pause mode
    if (!this.state.startIfTrue) {
      return;
    }

    this.setState({
      interval2: setInterval(
        () => this.setState({ timeLeft: this.state.timeLeft - 1 }),
        1000
      )
    });

    this.setState({
      clearingInterval2: setTimeout(() => {
        clearInterval(this.state.interval2);
      }, (this.state.initialTime + 1) * 1000)
    });

    this.setState({
      audio2: setTimeout(() => {
        this.audio01.play();
      }, (this.state.initialTime + 1) * 1000)
    });

    this.setState({
      breakStarting2: setTimeout(() => {
        this.timerStartWithoutButton();
      }, (this.state.initialTime + 1) * 1000)
    });
  }

  // runs at the end of 'session' mode (click does not trigger it)
  breakStartWithoutButton() {
    this.setState({ stringToDisplay: "Break" });

    this.setState({
      timeLeft: this.state.break,
      initialTime: this.state.break
    });

    this.setState({
      interval2: setInterval(
        () => this.setState({ timeLeft: this.state.timeLeft - 1 }),
        1000
      )
    });

    this.setState({
      clearingInterval2: setTimeout(() => {
        clearInterval(this.state.interval2);
      }, (this.state.initialTime + 1) * 1000)
    });

    this.setState({
      audio2: setTimeout(() => {
        this.audio01.play();
      }, (this.state.initialTime + 1) * 1000)
    });

    this.setState({
      breakStarting2: setTimeout(() => {
        this.timerStartWithoutButton();
      }, (this.state.initialTime + 1) * 1000)
    });
  }

  buttonToggle() {
    this.setState({ changeTimesIfTrue: false });

    if (!this.state.startIfTrue) {
      this.setState(
        //enabling countdown to pick up where it stopped after pausing and starting again
        { initialTime: this.state.timeLeft }
      );

      clearInterval(this.state.interval);
      clearInterval(this.state.interval2);
      clearInterval(this.state.clearingInterval);
      clearInterval(this.state.clearingInterval2);
      clearInterval(this.state.audio);
      clearInterval(this.state.audio2);
      clearInterval(this.state.breakStarting);
      clearInterval(this.state.breakStarting2);
    }

    this.setState({ startIfTrue: !this.state.startIfTrue });
  }

  reset() {
    ///reset works also if the timer is running
    if (!this.state.startIfTrue) {
      this.buttonToggle();
    }

    this.setState({
      stringToDisplay: "Session",
      timeLeft: 1500,
      initialTime: 1500,
      session: 1500,
      break: 300,
      changeTimesIfTrue: true
    });
  }

  render() {
    return (
      <Display
        display={this.state.timeLeft}
        session={this.state.session}
        break={this.state.break}
        sessionMinus={this.sessionMinus}
        sessionPlus={this.sessionPlus}
        breakMinus={this.breakMinus}
        breakPlus={this.breakPlus}
        timerStart={this.timerStart}
        breakStart={this.breakStart}
        stringToDisplay={this.state.stringToDisplay}
        buttonToggle={this.buttonToggle}
        reset={this.reset}
      />
    );
  }
}

function Display(props) {
  let minutes = Math.floor(props.display / 60);
  let seconds = props.display - minutes * 60;

  let minToString = "";
  let secToString = "";

  let styleStringToDisplay = "";

  if (props.stringToDisplay === "Session") {
    styleStringToDisplay = "teal";
  }

  if (props.stringToDisplay === "Break") {
    styleStringToDisplay = "crimson";
  }

  // displaying zero in front of single digits
  minutes >= 10
    ? (minToString = minutes.toString())
    : (minToString = "0" + minutes.toString());
  seconds >= 10
    ? (secToString = seconds.toString())
    : (secToString = "0" + seconds.toString());

  let finalFormat = minToString + ":" + secToString;

  //fix: the display will never show value less than 00:01
  let finalDisplay = "";

  if (props.display >= 0) {
    finalDisplay = finalFormat;
  } else {
    finalDisplay = "00:00";
  }

  return (
    <div className="App container-fluid">
      <div
        className="d-flex align-items-center"
        style={{
          height: "100vh",
          marginLeft: "-15px",
          marginRight: "-15px",
          backgroundColor: "white"
        }}
      >
        <div
          id="drum-machine"
          className="mx-auto text-center"
          style={{
            width: "350px",
            height: "450px",
            minWidth: "350px",
            borderRadius: "5px",
            backgroundColor: "#091834"
          }}
        >
          <br />
          <div className="mx-auto display-center">
            <p id="break-label" style={{ fontSize: "1.1em" }}>
              Break Length
              <p
                style={{
                  fontWeight: "bold",
                  color: "crimson",
                  fontSize: "1.1em"
                }}
              >
                {props.break/60}
              </p>
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-1 btn-blue"
              id="break-increment"
              onClick={() => props.breakPlus()}
            >
              +
            </button>
            <button
              className="btn btn-danger mx-1 btn-red"
              id="break-decrement"
              onClick={() => props.breakMinus()}
            >
              -
            </button>
          </div>

          <br />

          <div className="mx-auto display-center">
            <p id="session-label" style={{ fontSize: "1.1em" }}>
              Session Length
              <p
                style={{
                  fontWeight: "bold",
                  color: "teal",
                  fontSize: "1.1em"
                }}
              >
                {props.session/60}
              </p>
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-1 btn-blue"
              id="session-increment"
              onClick={() => props.sessionPlus()}
            >
              +
            </button>
            <button
              className="btn btn-danger mx-1 btn-red"
              id="session-decrement"
              onClick={() => props.sessionMinus()}
            >
              -
            </button>
          </div>
          <br />
          <div className="mx-auto display-center">
            <p
              id="timer-label"
              style={{
                fontSize: "1.1em",
                color: styleStringToDisplay,
                fontWeight: "bold"
              }}
            >
              {props.stringToDisplay}
            </p>
          </div>

          <div className="mx-auto display-center">
            <p id="time-left" style={{ fontSize: "2.2em" }}>
              {finalDisplay}
            </p>
            <audio id="beep">
            </audio>
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mx-1 btn-blue"
              id="start_stop"
              onClick={() => {
                props.buttonToggle();
                props.timerStart();
                props.breakStart();
              }}
            >
              Start | Pause
            </button>
            <button
              className="btn btn-danger mx-1 btn-red"
              id="reset"
              onClick={() => {
                props.reset();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
