import React from "react";
import { Table, Badge } from "react-bootstrap";

function LegalityTable({ legalities }) {
  return (
    <div>
      <Table striped bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            <td colSpan={4} className="text-center">
              <h4>Legality</h4>
            </td>
          </tr>
          <tr>
            <th>Format</th>
            <th>Legality</th>
            <th>Format</th>
            <th>Legality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard</td>
            <td>
              {legalities.standard === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Future</td>
            <td>
              {legalities.future === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Historic</td>
            <td>
              {legalities.historic === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Gladiator</td>
            <td>
              {legalities.gladiator === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Pioneer</td>
            <td>
              {legalities.pioneer === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Modern</td>
            <td>
              {legalities.modern === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Legacy</td>
            <td>
              {legalities.legacy === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Pauper</td>
            <td>
              {legalities.pauper === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Vintage</td>
            <td>
              {legalities.vintage === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Penny</td>
            <td>
              {legalities.penny === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Commander</td>
            <td>
              {legalities.commander === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Brawl</td>
            <td>
              {legalities.brawl === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Historic Brawl</td>
            <td>
              {legalities.historicbrawl === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Alchemy</td>
            <td>
              {legalities.alchemy === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Pauper Commander</td>
            <td>
              {legalities.paupercommander === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Duel</td>
            <td>
              {legalities.duel === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
          <tr>
            <td>Old School</td>
            <td>
              {legalities.oldschool === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
            <td>Pre-Modern</td>
            <td>
              {legalities.premodern === "legal" ? (
                <Badge bg="success">Legal</Badge>
              ) : (
                <Badge bg="danger">Not Legal</Badge>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default LegalityTable;
