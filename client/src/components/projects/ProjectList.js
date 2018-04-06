import React from 'react';
import { Link } from 'react-router-dom';

import { ListGroup, ListGroupItem } from 'reactstrap';

import styled from 'styled-components';

const Collection = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px;
`;

class ProjectList extends React.Component {
  state = {
    Projects: [],
  };
  render() {
    return (
      <Collection className="ProjectList">
        <Link to={`/`}>Home</Link>
        <h2>List of Projects</h2>
        <ListGroup>
          {this.state.Projects.map(project => (
            <div key={project.id}>
              <ListGroupItem>
                <Link to={`/api/projects/${project.id}`}>{project.name}</Link>
              </ListGroupItem>
            </div>
          ))}
        </ListGroup>
      </Collection>
    );
  }

  componentDidMount() {
    fetch(`http://localhost:5000/api/projects`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          Projects: data,
        })
      );
  }
}

export default ProjectList;
