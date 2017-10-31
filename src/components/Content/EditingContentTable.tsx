import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

const UNEDITABLE_KEYS = ['id'];

function normalizeRow({
  row,
  data,
  updateData,
  addChange,
}: {
  row: string | { fieldName: any; fieldValue: any };
  data: Object[];
  updateData: Function;
  addChange: Function;
}) {
  const rowData =
    typeof row === 'string'
      ? {
          fieldName: row,
          fieldValue: UNEDITABLE_KEYS.includes(row) ? (
            data[row] || ''
          ) : (
            <input
              onChange={e => updateData({ [row]: e.target.value })}
              type="test"
              value={data[row] || ''}
            />
          ),
        }
      : row;

  return {
    fieldName:
      typeof rowData.fieldName === 'function'
        ? rowData.fieldName({ data, editing: true, onChange: addChange })
        : _.upperCase(rowData.fieldName),
    fieldValue:
      typeof rowData.fieldValue === 'function'
        ? rowData.fieldValue({ data, editing: true, onChange: addChange })
        : rowData.fieldValue,
  };
}

class EditingContentTable extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.data,
      additionalChanges: {},
    };
  }
  save = () => {
    const { data, additionalChanges } = this.state;
    return Promise.all([
      Promise.all(Object.keys(additionalChanges).map(key => additionalChanges[key]())),
      this.props.updateData({ data }),
    ]);
  };

  render() {
    const { rows } = this.props;
    const { data, additionalChanges } = this.state;

    return (
      <Table basic="very" style={{ fontSize: 18 }}>
        <Table.Body>
          {rows.map(row => {
            const { fieldName, fieldValue } = normalizeRow({
              row,
              data,
              addChange: change => {
                this.setState({ additionalChanges: { ...additionalChanges, ...change } });
              },
              updateData: change => {
                const newData = { ...data, ...change };
                this.setState({ data: newData });
              },
            });

            return (
              <Table.Row key={`${data.id}-${fieldName}`} style={{ verticalAlign: 'baseline' }}>
                <Table.Cell
                  style={{
                    fontSize: '0.65em',
                    border: 'none',
                    textAlign: 'right',
                    width: '6em',
                  }}
                >
                  {fieldName}
                </Table.Cell>
                <Table.Cell style={{ border: 'none' }}>{fieldValue}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
export default EditingContentTable;
