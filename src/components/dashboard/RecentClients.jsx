import './styles/RecentClients.css'

const CLIENTS = [
  { name: 'Saudi Telecom Co.',   sector: 'Telecom',  status: 'active',   joined: 'Sep 2024' },
  { name: 'Noon Digital',        sector: 'E-Commerce', status: 'active', joined: 'Aug 2024' },
  { name: 'Alrajhi Bank',        sector: 'Finance',  status: 'pending',  joined: 'Oct 2024' },
  { name: 'SABIC Industries',    sector: 'Energy',   status: 'active',   joined: 'Jul 2024' },
  { name: 'Flynas Airlines',     sector: 'Aviation', status: 'inactive', joined: 'Jun 2024' },
]

export default function RecentClients() {
  return (
    <div className="recent-clients">
      <div className="recent-clients__title">Recent Clients</div>
      <table className="recent-clients__table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Sector</th>
            <th>Status</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {CLIENTS.map((client) => (
            <tr key={client.name}>
              <td>{client.name}</td>
              <td>{client.sector}</td>
              <td>
                <span className={`badge badge--${client.status}`}>
                  {client.status}
                </span>
              </td>
              <td>{client.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}