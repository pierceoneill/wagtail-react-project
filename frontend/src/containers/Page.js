import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import axios from 'axios';
import { Box } from 'rebass';

import * as reducers from '../services/reducers';
import {
  fetchPageMeta,
  fetchPageWithId,
  fetchPageChildren
} from '../services/actions/page';

import Loading from '../components/Loading';
import BlogIndexPage from './BlogIndexPage';
import BlogPage from './BlogPage';
import StandardPage from './StandardPage';
import PortfolioIndexPage from './PortfolioIndexPage';

class Page extends Component {
  state = {
    loading: true
  };

  componentWillMount() {
    this.setState({ loading: true });
    const { getPageMeta, match } = this.props;
    // console.log('Page match', match);
    const isChildPage = Object.prototype.hasOwnProperty.call(
      match.params,
      'child'
    );
    if (isChildPage) {
      getPageMeta(match.params.child);
    } else {
      getPageMeta(match.params.slug);
    }
    // const state = { type: 'blog.BlogIndexPage' };
    // console.log('will mount meta', meta);
    // getPageMeta(match.params.slug);
    this.setState({ loading: false });
  }

  componentDidMount() {
    // const { getPageDetails, meta } = this.props;
    // getPageDetails(meta[0].id);
  }

  render() {
    const { loading } = this.state;

    const { meta, match } = this.props;
    // console.log('match', match);
    const isChildPage = Object.prototype.hasOwnProperty.call(
      match.params,
      'child'
    );
    let ready = true;
    // console.log(pathname, meta.meta.html_url);

    // console.log('props', this.props);
    let pageSpace = <Loading />;

    if (meta.meta.type === 'blog.BlogIndexPage' && ready) {
      pageSpace =
        <BlogIndexPage id={meta.id} type={meta.meta.type}/>;
    }
    if (meta.meta.type === 'pages.StandardPage') {
      pageSpace =
        <StandardPage id={meta.id} type={meta.meta.type}/>;
    }
    if (meta.meta.type === 'blog.BlogPage' && ready) {
      pageSpace = <BlogPage id={meta.id} type={meta.meta.type}/>;
    }
    if (meta.meta.type === 'portfolio.PortfolioIndexPage' && ready) {
      pageSpace = <PortfolioIndexPage id={meta.id} type={meta.meta.type}/>;
    }

    // if (pathname !== meta.meta.html_url) {
    //   pageSpace = <Text className="uk-position-center">Loading...</Text>;
    // }
    if (isChildPage) {
      if (match.params.child !== meta.meta.slug) {
        ready = false;
        pageSpace = <Loading />;
      }
    }
    if (!isChildPage) {
      if (match.params.slug !== meta.meta.slug) {
        ready = false;
        pageSpace = <Loading />;
      }
    }

    return (
      <Box >
        {loading && ready ? pageSpace : pageSpace}
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  meta: reducers.refreshPageMeta(state),
  details: reducers.refreshPage(state)
});

const mapDispatchToProps = dispatch => ({
  getPageMeta(slug) {
    dispatch(fetchPageMeta(slug));
  },
  getPageDetails(id) {
    dispatch(fetchPageWithId(id));
  },
  getPageChildren(id) {
    dispatch(fetchPageChildren(id));
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Page)
);
