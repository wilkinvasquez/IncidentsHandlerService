﻿using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Incidentium.Data.Repositories.Interfaces;
using Incidentium.Domain.Models;
using Incidentium.Services.DTOs;
using Incidentium.Services.Entities.BaseService;
using Incidentium.Services.Interfaces;
using Incidentium.Services.Interfaces.BaseInterface;

namespace Incidentium.Services.Entities
{
    public class IncidentService : BaseService<Incident, IIncidentRepository>, IIncidentService
    {
        private readonly IIncidentHistoryRepository _incidentHistoryRepository;
        private readonly IUserRepository _userRepository;

        public IncidentService(
            IIncidentRepository baseRepository,
            IMapper mapper,
            ITokenService tokenService,
            IIncidentHistoryRepository incidentHistoryRepository,
            IUserRepository userRepository
        ) : base(baseRepository, mapper, tokenService)
        {
            _incidentHistoryRepository = incidentHistoryRepository;
            _userRepository = userRepository;
        }

        public ICollection<IncidentCommentDto> GetIncidentComments(int incidentId)
        {
            IQueryable<IncidentHistory> incidentsHitories = _incidentHistoryRepository.GetAll();
            IQueryable<User> users = _userRepository.GetAll();

            ICollection<IncidentCommentDto> incidentComments = (
                from ih in incidentsHitories
                join u in users on ih.CreatorUserId equals u.Id
                where ih.IncidentId == incidentId
                select new IncidentCommentDto()
                {
                    Comment = ih.Comment,
                    CreatorName = u.Name,
                    CreatorLastname = u.Lastname,
                    CreationTime = ih.CreationTime,
                    CreatorUserId = ih.CreatorUserId,
                    LastModificationTime = ih.LastModificationTime,
                    LastModifierUserId = ih.LastModifierUserId,
                    IsDeleted = ih.IsDeleted,
                    DeletionTime = ih.DeletionTime,
                    DeleterUserId = ih.DeleterUserId
                }
            ).OrderBy(x => x.CreationTime).ToList();

            return incidentComments;
        }

        public IncidentsStaticticsDto GetIncidentsStatictics()
        {
            IQueryable<Incident> incidents = _baseRepository.GetAll();

            return new IncidentsStaticticsDto() {
                TotalUnClosedIncidents = incidents.Where(x => x.IsClosed == false).Count(),
                TotalClosedIncidents = incidents.Where(x => x.IsClosed == true).Count()
            };
        }
    }
}
