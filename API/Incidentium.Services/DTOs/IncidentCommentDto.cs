using System;
using System.Collections.Generic;
using System.Text;
using Incidentium.Services.DTOs.BaseEntityDto;

namespace Incidentium.Services.DTOs
{
    public class IncidentCommentDto : EntityDto
    {
        public string Comment { get; set; } 
        public string CreatorName { get; set; }
        public string CreatorLastname { get; set; }
    }
}
