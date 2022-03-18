import React from "react";
import Table from "react-bootstrap/Table";

function CardDetailTable({ cardData }) {
  return (
    <div>
      <Table bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            <td colSpan={2} className="text-center">
              <h4>Card Details</h4>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Card Name:</td>
            <td>{cardData.data.name}</td>
          </tr>
          <tr>
            <td>Mana Cost:</td>
            <td>{cardData.data.mana_cost}</td>
          </tr>
          <tr>
            <td>Converted Mana Cost:</td>
            <td>{cardData.data.cmc}</td>
          </tr>
          <tr>
            <td>Rarity:</td>
            <td>{cardData.data.rarity}</td>
          </tr>
          <tr>
            <td>Card Type:</td>
            <td>{cardData.data.type_line}</td>
          </tr>
          <tr>
            <td>Oracle Text:</td>
            <td>{cardData.data.oracle_text}</td>
          </tr>
          <tr>
            <td>Colors:</td>
            <td>{cardData.data.colors}</td>
          </tr>
          <tr>
            <td>Color Identity:</td>
            <td>{cardData.data.color_indentity}</td>
          </tr>
          <tr>
            <td>Keywords:</td>
            <td>{cardData.data.keywords}</td>
          </tr>
          <tr>
            <td>Set Name:</td>
            <td>{cardData.data.set_name}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default CardDetailTable;
