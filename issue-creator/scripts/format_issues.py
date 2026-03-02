#!/usr/bin/env python3
"""
Format issues for development team import from various sources.
This script helps structure issues in a format ready for Linear or other issue tracking systems.
Handles PRDs, bug reports, feature requests, and technical specifications.
"""

import json
import re
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field, asdict
from datetime import datetime


@dataclass
class LinearIssue:
    """Represents a Linear issue with all necessary fields."""
    
    title: str
    description: str
    priority: Optional[int] = 3  # 0=none, 1=urgent, 2=high, 3=medium, 4=low
    estimate: Optional[int] = None  # Story points
    labels: List[str] = field(default_factory=list)
    acceptance_criteria: List[str] = field(default_factory=list)
    testing_requirements: Dict[str, List[str]] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)
    technical_notes: List[str] = field(default_factory=list)
    
    def to_linear_format(self) -> Dict[str, Any]:
        """Convert to Linear API format."""
        # Format acceptance criteria as checklist
        criteria_text = "\n".join([f"- [ ] {criterion}" for criterion in self.acceptance_criteria])
        
        # Format testing requirements
        testing_sections = []
        for test_type, tests in self.testing_requirements.items():
            test_list = "\n".join([f"- Test: {test}" for test in tests])
            testing_sections.append(f"**{test_type}:**\n{test_list}")
        testing_text = "\n\n".join(testing_sections)
        
        # Build full description
        description_parts = [self.description]
        
        if self.acceptance_criteria:
            description_parts.append(f"\n## Acceptance Criteria\n{criteria_text}")
        
        if self.testing_requirements:
            description_parts.append(f"\n## Testing Requirements\n{testing_text}")
        
        if self.technical_notes:
            notes_text = "\n".join([f"- {note}" for note in self.technical_notes])
            description_parts.append(f"\n## Technical Notes\n{notes_text}")
        
        if self.dependencies:
            deps_text = "\n".join([f"- {dep}" for dep in self.dependencies])
            description_parts.append(f"\n## Dependencies\n{deps_text}")
        
        return {
            "title": self.title,
            "description": "\n".join(description_parts),
            "priority": self.priority,
            "estimate": self.estimate,
            "labels": self.labels
        }
    
    def to_markdown(self) -> str:
        """Convert to markdown format for review."""
        md_parts = [f"# {self.title}\n"]
        
        if self.estimate:
            md_parts.append(f"**Estimate:** {self.estimate} points\n")
        
        if self.labels:
            md_parts.append(f"**Labels:** {', '.join(self.labels)}\n")
        
        md_parts.append(f"\n{self.description}\n")
        
        if self.acceptance_criteria:
            md_parts.append("\n## Acceptance Criteria")
            for criterion in self.acceptance_criteria:
                md_parts.append(f"- [ ] {criterion}")
        
        if self.testing_requirements:
            md_parts.append("\n## Testing Requirements")
            for test_type, tests in self.testing_requirements.items():
                md_parts.append(f"\n**{test_type}:**")
                for test in tests:
                    md_parts.append(f"- Test: {test}")
        
        if self.technical_notes:
            md_parts.append("\n## Technical Notes")
            for note in self.technical_notes:
                md_parts.append(f"- {note}")
        
        if self.dependencies:
            md_parts.append("\n## Dependencies")
            for dep in self.dependencies:
                md_parts.append(f"- {dep}")
        
        return "\n".join(md_parts)


class PRDParser:
    """Parse PRD sections into structured data."""
    
    @staticmethod
    def extract_requirements(text: str) -> List[str]:
        """Extract requirements from PRD text."""
        requirements = []
        
        # Look for bullet points
        bullet_pattern = r'^\s*[-*•]\s+(.+)$'
        for line in text.split('\n'):
            match = re.match(bullet_pattern, line)
            if match:
                requirements.append(match.group(1).strip())
        
        # Look for numbered lists
        number_pattern = r'^\s*\d+\.\s+(.+)$'
        for line in text.split('\n'):
            match = re.match(number_pattern, line)
            if match:
                requirements.append(match.group(1).strip())
        
        # Look for acceptance criteria patterns
        criteria_pattern = r'\[\s*\]\s+(.+)$'
        for line in text.split('\n'):
            match = re.match(criteria_pattern, line)
            if match:
                requirements.append(match.group(1).strip())
        
        return requirements
    
    @staticmethod
    def extract_dependencies(text: str) -> List[str]:
        """Extract dependencies from PRD text."""
        dependencies = []
        
        # Keywords that indicate dependencies
        dependency_keywords = [
            'depends on', 'requires', 'needs', 'after', 'following',
            'blocked by', 'waiting for', 'prerequisite'
        ]
        
        for line in text.split('\n'):
            lower_line = line.lower()
            for keyword in dependency_keywords:
                if keyword in lower_line:
                    dependencies.append(line.strip())
                    break
        
        return dependencies
    
    @staticmethod
    def estimate_from_text(text: str) -> Optional[int]:
        """Estimate story points based on text complexity indicators."""
        text_lower = text.lower()
        
        # Complexity indicators
        if any(word in text_lower for word in ['simple', 'basic', 'straightforward', 'trivial']):
            return 1
        elif any(word in text_lower for word in ['complex', 'extensive', 'comprehensive', 'advanced']):
            return 8
        elif any(word in text_lower for word in ['integration', 'migration', 'refactor']):
            return 5
        elif any(word in text_lower for word in ['moderate', 'standard', 'typical']):
            return 3
        
        # Default based on text length
        word_count = len(text.split())
        if word_count < 50:
            return 2
        elif word_count < 200:
            return 3
        elif word_count < 500:
            return 5
        else:
            return 8


class IssueGenerator:
    """Generate development issues from various sources."""
    
    def __init__(self):
        self.parser = PRDParser()
    
    def create_issue_from_section(
        self,
        title: str,
        description: str,
        source_context: str = "",
        issue_type: str = "feature"
    ) -> LinearIssue:
        """Create an issue from any source material section."""
        
        # Extract structured data from the description
        requirements = self.parser.extract_requirements(description)
        dependencies = self.parser.extract_dependencies(source_context)
        estimate = self.parser.estimate_from_text(description)
        
        # Determine labels based on content and type
        labels = [issue_type]
        if issue_type == "bug":
            labels.append("bug-fix")
        if 'api' in description.lower():
            labels.append('backend')
        if 'ui' in description.lower() or 'frontend' in description.lower():
            labels.append('frontend')
        if 'database' in description.lower() or 'migration' in description.lower():
            labels.append('database')
        if 'performance' in description.lower():
            labels.append('performance')
        if 'security' in description.lower():
            labels.append('security')
        
        # Create acceptance criteria from requirements
        acceptance_criteria = []
        for req in requirements[:5]:  # Limit to top 5 most relevant
            if any(keyword in req.lower() for keyword in ['should', 'must', 'will', 'can']):
                acceptance_criteria.append(req)
        
        # Generate testing requirements based on issue type
        testing_requirements = self._generate_testing_requirements(issue_type, description)
        
        # Add technical notes if relevant
        technical_notes = []
        if 'performance' in description.lower():
            technical_notes.append("Consider performance implications")
        if 'security' in description.lower():
            technical_notes.append("Ensure proper security measures")
        if 'migration' in description.lower():
            technical_notes.append("Plan rollback strategy")
        
        # Adjust priority based on issue type and keywords
        priority = 3  # Default medium
        if issue_type == "bug":
            if any(word in description.lower() for word in ['critical', 'urgent', 'broken', 'down']):
                priority = 1  # Urgent
            elif any(word in description.lower() for word in ['major', 'important']):
                priority = 2  # High
        
        return LinearIssue(
            title=title,
            description=description,
            priority=priority,
            estimate=estimate,
            labels=labels,
            acceptance_criteria=acceptance_criteria,
            testing_requirements=testing_requirements,
            dependencies=dependencies,
            technical_notes=technical_notes
        )
    
    def _generate_testing_requirements(
        self,
        issue_type: str,
        description: str
    ) -> Dict[str, List[str]]:
        """Generate testing requirements based on issue type."""
        
        testing = {}
        
        if issue_type == "bug":
            # Bug fixes need regression tests
            testing["Regression Tests"] = [
                "Verify bug is fixed",
                "Ensure no new issues introduced",
                "Test related functionality"
            ]
            testing["Unit Tests"] = [
                "Add test case that reproduces the bug",
                "Verify fix resolves the issue"
            ]
        else:
            # Unit tests are almost always needed for features
            testing["Unit Tests"] = [
                "Validate core functionality",
                "Test edge cases",
                "Verify error handling"
            ]
        
        # Add integration tests for APIs and integrations
        if issue_type in ['api', 'integration'] or 'api' in description.lower():
            testing["Integration Tests"] = [
                "Test API endpoints with valid data",
                "Test error responses",
                "Verify database transactions"
            ]
        
        # Add E2E tests for user-facing features
        if issue_type in ['feature', 'story', 'ui'] or 'user' in description.lower():
            testing["E2E Tests"] = [
                "Complete user workflow",
                "Verify UI updates correctly",
                "Test failure scenarios"
            ]
        
        # Add performance tests if mentioned
        if 'performance' in description.lower() or 'load' in description.lower():
            testing["Performance Tests"] = [
                "Verify response times meet requirements",
                "Test under expected load",
                "Check resource usage"
            ]
        
        return testing


def format_issues_for_linear(issues: List[LinearIssue], output_format: str = "json") -> str:
    """Format a list of issues for Linear import."""
    
    if output_format == "json":
        return json.dumps(
            [issue.to_linear_format() for issue in issues],
            indent=2
        )
    elif output_format == "markdown":
        return "\n\n---\n\n".join([issue.to_markdown() for issue in issues])
    else:
        raise ValueError(f"Unknown output format: {output_format}")


def create_dependency_graph(issues: List[LinearIssue]) -> str:
    """Create a simple text-based dependency graph."""
    
    graph = ["# Dependency Graph\n"]
    
    for i, issue in enumerate(issues, 1):
        graph.append(f"{i}. {issue.title}")
        if issue.dependencies:
            for dep in issue.dependencies:
                graph.append(f"   └─> {dep}")
    
    return "\n".join(graph)


# Example usage
if __name__ == "__main__":
    # Example of creating an issue
    generator = IssueGenerator()
    
    example_issue = generator.create_issue_from_section(
        title="Implement User Authentication API",
        description="""
        Create a REST API for user authentication including login, logout, and token refresh.
        The API should use JWT tokens and include rate limiting.
        """,
        source_context="This is part of the user management system that depends on the database schema being set up.",
        issue_type="api"
    )
    
    print("Example Issue (Markdown format):")
    print(example_issue.to_markdown())
    print("\n\nExample Issue (Linear format):")
    print(json.dumps(example_issue.to_linear_format(), indent=2))