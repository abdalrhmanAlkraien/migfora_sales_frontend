import './styles/ActiveProjects.css'

const PROJECTS = [
  { name: 'STC Cloud Migration',     progress: 78, due: 'Nov 30, 2024', team: 4 },
  { name: 'Noon AWS Infrastructure', progress: 45, due: 'Dec 15, 2024', team: 3 },
  { name: 'Alrajhi DevOps Setup',    progress: 20, due: 'Jan 10, 2025', team: 2 },
  { name: 'SABIC Cost Optimization', progress: 92, due: 'Nov 15, 2024', team: 5 },
]

export default function ActiveProjects() {
  return (
    <div className="active-projects">
      <div className="active-projects__title">Active Projects</div>
      {PROJECTS.map((project) => (
        <div key={project.name} className="project-item">
          <div className="project-item__header">
            <span className="project-item__name">{project.name}</span>
            <span className="project-item__percent">{project.progress}%</span>
          </div>
          <div className="project-item__bar-bg">
            <div
              className="project-item__bar-fill"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <div className="project-item__meta">
            Due {project.due} · {project.team} team members
          </div>
        </div>
      ))}
    </div>
  )
}