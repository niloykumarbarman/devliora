using Devliora.Domain.Common;
using Devliora.Domain.Enums;
namespace Devliora.Domain.Entities;
public class TechnologyItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public TechnologyCategory Category { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Comma-separated related frameworks/tools shown under this entry on
    // the /technologies page's per-category rows (e.g. "Django, FastAPI,
    // Flask, Celery" for Python) — matches kaz.com.bd/technologies'
    // per-language sub-list, optional so existing entries keep working
    // without it.
    public string Frameworks { get; set; } = string.Empty;
}
