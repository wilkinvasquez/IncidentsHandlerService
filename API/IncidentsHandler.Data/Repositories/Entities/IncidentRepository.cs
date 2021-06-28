﻿using IncidentsHandler.Data.Context;
using IncidentsHandler.Data.Repositories.Entities.BaseRepository;
using IncidentsHandler.Data.Repositories.Interfaces;
using IncidentsHandler.Domain.Models;

namespace IncidentsHandler.Data.Repositories.Entities
{
    public class IncidentRepository : BaseRepository<Incident>, IIncidentRepository
    {
        public IncidentRepository(IncidentsHandlerDbContext context) : base(context)
        {

        }
    }
}
