import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DocumentChecklist = ({ documents, serviceType, onComplete }) => {
  const [checkedDocs, setCheckedDocs] = useState({});

  const handleCheckChange = (docId, checked) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docId]: checked
    }));
  };

  const allChecked = documents?.every(doc => checkedDocs?.[doc?.id]);
  const checkedCount = Object.values(checkedDocs)?.filter(Boolean)?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-headline font-semibold text-foreground mb-1">
            Required Documents
          </h3>
          <p className="text-sm text-muted-foreground">
            Please ensure you have all documents ready before proceeding
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{checkedCount}/{documents?.length}</div>
          <div className="text-xs text-muted-foreground">Documents Ready</div>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {documents?.map((doc) => (
          <div key={doc?.id} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
            <Checkbox
              checked={checkedDocs?.[doc?.id] || false}
              onChange={(e) => handleCheckChange(doc?.id, e?.target?.checked)}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name={doc?.icon} size={16} color="var(--color-primary)" />
                <span className="font-medium text-foreground">{doc?.name}</span>
                {doc?.isMandatory && (
                  <span className="text-xs text-error">*Required</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{doc?.description}</p>
              
              {doc?.specifications && (
                <div className="flex flex-wrap gap-2">
                  {doc?.specifications?.map((spec, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-background rounded-md text-muted-foreground">
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Document Guidelines</p>
            <p className="text-xs text-muted-foreground">
              All documents must be clear, colored scans or photos. File size should not exceed 5MB per document.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          variant="default"
          disabled={!allChecked}
          iconName="ArrowRight"
          iconPosition="right"
          onClick={onComplete}
        >
          Proceed to Upload
        </Button>
      </div>
    </div>
  );
};

export default DocumentChecklist;