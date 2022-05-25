import React, {PureComponent} from 'react';

const ItemContext = React.createContext();
const {Provider, Consumer} = ItemContext;

class ItemProvider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
    };
  }

  handleSelectItem = item => {
    this.setState({selectedItem: item});
  };

  render() {
    const {selectedItem} = this.state;
    const {children} = this.props;
    return (
      <Provider
        value={{
          selectedItem,
          setSelectedItem: this.handleSelectItem,
        }}>
        {children}
      </Provider>
    );
  }
}

export {ItemContext, ItemProvider, Consumer as ItemConsumer};
