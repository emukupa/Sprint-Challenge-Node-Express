import React from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

class Project extends React.Component {
  state = {
    Project: {},
    Actions: [],
  };
  render() {
    return (
      <Card>
        <CardBody>
          <Link to={`/`}>Home</Link> /
          <Link to={`/api/projects`}> List of Projects</Link>
          <CardTitle className={`mt-3`}>
            Project Name: {this.state.Project.name}
          </CardTitle>
          <ListGroup>
            {this.state.Actions.map(action => (
              <ListGroupItem key={action.id}>
                {action.description}
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    );
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    fetch(`http://localhost:5000/api/projects/${id}`)
      .then(response => response.json())
      .then(data => {
        const project = { ...data };
        if (Number(project.id) === Number(id)) {
          fetch(`http://localhost:5000/api/users/${id}/actions`)
            .then(response => response.json())
            .then(actions => {
              this.setState({
                Project: project,
                Actions: actions,
              });
            });
        }
      });
  }
}

export default Project;
