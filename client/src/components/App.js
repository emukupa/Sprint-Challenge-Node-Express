import React from 'react';
import { Route, Link } from 'react-router-dom';

import ProjectList from './projects/ProjectList';
import Project from './projects/Project';

import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import './App.css';

const Home = () => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to={`/`}>Home</Link>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Link to={`/api/projects`}> List of Projects</Link>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

class App extends React.Component {
  render() {
    return (
      <Container className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/api/projects/" component={ProjectList} />
        <Route path="/api/projects/:id" component={Project} />
      </Container>
    );
  }
  componentDidMount() {}
}

export default App;
