import React, { PureComponent } from 'react';
import { array } from 'prop-types';

import ColumnItem from './ColumnItem';

class InnerList extends PureComponent {
  render() {
    const { data } = this.props;

    return data.map( ( item, index ) => (
      <ColumnItem data={ item } index={ index } key={ item.field } />
    ) );
  }
}

InnerList.propTypes = {
  data: array
};

export default InnerList;
